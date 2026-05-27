// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authController = {
    // 1. HÀM TẠO ACCESS TOKEN (Sống ngắn: vd 15 phút hoặc 1 ngày tùy dự án)
    generateAccessToken: (user) => {
        return jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: '1d' } // Thực tế access token thường để '15m'
        );
    },

    // 2. HÀM TẠO REFRESH TOKEN (Sống dai: vd 7 ngày hoặc 365 ngày)
    generateRefreshToken: (user) => {
        return jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '365d' }
        );
    },

    // 3. ĐĂNG KÝ (Trả về Token luôn để auto-login)
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            
            // Kiểm tra username đã tồn tại chưa
            const existingUser = await User.findOne({ username });
            if (existingUser) return res.status(400).json({ message: "Username đã được sử dụng!" });

            // Kiểm tra email nếu có truyền lên
            if (email) {
                const existingEmail = await User.findOne({ email });
                if (existingEmail) return res.status(400).json({ message: "Email đã được sử dụng!" });
            }

            const newUser = new User({ 
                username, 
                password,
                ...(email && { email }) // Chỉ gán email nếu có giá trị
            });
            const savedUser = await newUser.save();

            // Tự động tạo token để auto login
            const accessToken = authController.generateAccessToken(savedUser);
            const refreshToken = authController.generateRefreshToken(savedUser);

            savedUser.refreshTokens.push(refreshToken);
            await savedUser.save();

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            const { password: pw, refreshTokens, ...others } = savedUser._doc;

            res.status(201).json({ 
                message: "Đăng ký thành công!", 
                user: others,
                accessToken
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 4. ĐĂNG NHẬP (Bằng Username)
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản!" });

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return res.status(400).json({ message: "Sai mật khẩu!" });

            if (user && validPassword) {
                // Tạo 2 loại Token
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);

                user.refreshTokens.push(refreshToken);
                await user.save();

                // Lưu Refresh Token vào Cookie (HttpOnly bảo mật)
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false, // Set là true khi deploy lên production có HTTPS
                    path: "/",
                    sameSite: "strict",
                });

                const { password: pw, ...others } = user._doc;
                
                // Trả về Access Token qua JSON
                res.status(200).json({ 
                    message: "Đăng nhập thành công!", 
                    user: others, 
                    accessToken 
                });
            }
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 4.5. ĐĂNG NHẬP BẰNG GOOGLE
    googleLogin: async (req, res) => {
        try {
            const { token } = req.body;
            
            // Verify Google token
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const email = payload.email;
            
            // Kiểm tra user có tồn tại bằng email này không
            let user = await User.findOne({ email });

            if (!user) {
                // Tự động tạo user mới nếu chưa có
                // Lấy phần đầu của email làm username, hoặc random
                const baseUsername = email.split('@')[0];
                let username = baseUsername;
                let userExists = await User.findOne({ username });
                let counter = 1;
                while (userExists) {
                    username = `${baseUsername}${counter}`;
                    userExists = await User.findOne({ username });
                    counter++;
                }

                const randomPassword = crypto.randomBytes(10).toString('hex');

                user = new User({
                    username: username,
                    email: email,
                    password: randomPassword,
                    isEmailVerified: true // Đã login google thì coi như xác thực rồi
                });
                await user.save();
            } else {
                // Nếu user đã tồn tại bằng email này (tạo thủ công trước đây)
                // Cập nhật isEmailVerified thành true luôn
                if (!user.isEmailVerified) {
                    user.isEmailVerified = true;
                    await user.save();
                }
            }

            // Sinh token đăng nhập
            const accessToken = authController.generateAccessToken(user);
            const refreshToken = authController.generateRefreshToken(user);

            user.refreshTokens.push(refreshToken);
            await user.save();

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            const { password: pw, refreshTokens, ...others } = user._doc;

            res.status(200).json({ 
                message: "Đăng nhập Google thành công!", 
                user: others,
                accessToken
            });

        } catch (error) {
            res.status(500).json({ message: "Xác thực Google thất bại", error: error.message });
        }
    },

    // 5. YÊU CẦU REFRESH TOKEN MỚI (Khi Access Token hết hạn)
    requestRefreshToken: async (req, res) => {
        try {
            // Lấy refresh token từ cookie
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(401).json({ message: "Bạn chưa đăng nhập!" });

            const foundUser = await User.findOne({ refreshTokens: refreshToken });
            if (!foundUser) return res.status(403).json({ message: "Token không hợp lệ hoặc đã bị revoke!" });

            // Xác thực token
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err) => {
                if (err) return res.status(403).json({ message: "Refresh Token không hợp lệ hoặc đã hết hạn!" });

                // Nếu hợp lệ, tạo bộ token mới
                const newAccessToken = authController.generateAccessToken(foundUser);
                const newRefreshToken = authController.generateRefreshToken(foundUser);

                // Cập nhật lại mảng token trong DB
                foundUser.refreshTokens = foundUser.refreshTokens.filter(token => token !== refreshToken);
                foundUser.refreshTokens.push(newRefreshToken);
                await foundUser.save();

                // Cập nhật lại cookie mới
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });

                res.status(200).json({
                    accessToken: newAccessToken
                });
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 6. ĐĂNG XUẤT (Clear Cookie)
    logout: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            
            // XÓA TOKEN KHỎI DB CỦA USER ĐÓ
            if (refreshToken) {
                const user = await User.findOne({ refreshTokens: refreshToken });
                if (user) {
                    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
                    await user.save();
                }
            }

            res.clearCookie("refreshToken", { path: "/" });
            res.status(200).json({ message: "Đăng xuất thành công và đã xóa Token!" });
        } catch (error) {
            res.status(500).json({
            message: "Lỗi server",
            error: error.message
            });
        }
    },

    // 7. CẬP NHẬT THÔNG TIN CÁ NHÂN (Username)
    updateProfile: async (req, res) => {
        try {
            const { username, email } = req.body;
            const updateData = {};
            if (username) updateData.username = username;
            if (email !== undefined) updateData.email = email;

            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                updateData,
                { new: true }
            ).select('-password -refreshTokens');

            if (!updatedUser) {
                return res.status(404).json({ message: "Không tìm thấy người dùng!" });
            }

            res.status(200).json({ message: "Cập nhật thông tin thành công!", user: updatedUser });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 7.5. CẬP NHẬT AVATAR
    updateAvatar: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Vui lòng chọn ảnh avatar!" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                { avatar: req.file.path },
                { new: true }
            ).select('-password -refreshTokens');

            if (!updatedUser) {
                return res.status(404).json({ message: "Không tìm thấy người dùng!" });
            }

            res.status(200).json({ message: "Cập nhật avatar thành công!", user: updatedUser });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 8. ĐỔI MẬT KHẨU
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findById(req.user.id);
            
            if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

            // Kiểm tra pass cũ
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Mật khẩu hiện tại không đúng!" });
            }

            user.password = newPassword;
            await user.save();

            res.status(200).json({ message: "Đổi mật khẩu thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 9. GỬI MÃ XÁC THỰC EMAIL
    sendVerificationEmail: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: "Không tìm thấy user!" });
            if (!user.email) return res.status(400).json({ message: "Tài khoản chưa có email. Vui lòng thêm email trước!" });
            if (user.isEmailVerified) return res.status(400).json({ message: "Email này đã được xác thực rồi!" });

            // Tạo token ngẫu nhiên 6 số
            const token = Math.floor(100000 + Math.random() * 900000).toString();
            user.emailVerificationToken = token;
            await user.save();

            // Gửi qua email
            const message = `
                <h2>Xác thực Email - KuroTech</h2>
                <p>Mã xác thực của bạn là: <strong>${token}</strong></p>
                <p>Vui lòng nhập mã này trên trang web để hoàn tất xác thực.</p>
            `;
            await sendEmail({
                email: user.email,
                subject: 'KuroTech - Mã Xác Thực Email',
                html: message
            });

            res.status(200).json({ message: "Đã gửi mã xác thực tới email của bạn!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 10. XÁC NHẬN MÃ EMAIL
    verifyEmail: async (req, res) => {
        try {
            const { token } = req.body;
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: "Không tìm thấy user!" });

            if (user.emailVerificationToken !== token) {
                return res.status(400).json({ message: "Mã xác thực không hợp lệ!" });
            }

            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            await user.save();

            res.status(200).json({ message: "Xác thực email thành công!", user: { ...user._doc, password: "", refreshTokens: [] } });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 11. QUÊN MẬT KHẨU
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy tài khoản với email này!" });
            }
            if (!user.isEmailVerified) {
                return res.status(400).json({ message: "Email này chưa được xác thực. Không thể khôi phục mật khẩu!" });
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            user.passwordResetToken = resetToken;
            user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 mins
            await user.save();

            const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password/${resetToken}`;
            const message = `
                <h2>Khôi phục mật khẩu - KuroTech</h2>
                <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu (có hiệu lực 15 phút):</p>
                <a href="${resetUrl}">${resetUrl}</a>
            `;

            await sendEmail({
                email: user.email,
                subject: 'KuroTech - Khôi Phục Mật Khẩu',
                html: message
            });

            res.status(200).json({ message: "Đã gửi link khôi phục tới email của bạn!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // 12. ĐẶT LẠI MẬT KHẨU (RESET)
    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            const user = await User.findOne({ 
                passwordResetToken: token,
                passwordResetExpires: { $gt: Date.now() } // Còn hạn
            });

            if (!user) {
                return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
            }

            user.password = newPassword;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            res.status(200).json({ message: "Khôi phục mật khẩu thành công! Vui lòng đăng nhập lại." });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = authController;
