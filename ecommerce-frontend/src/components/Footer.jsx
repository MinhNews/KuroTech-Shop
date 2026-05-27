import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Cột 1: Thông tin công ty */}
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-1 mb-6">
              <span className="text-white">Kuro</span><span className="text-slate-500 font-light">Tech</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-6">
              Hệ thống bán lẻ điện thoại, laptop, phụ kiện chính hãng hàng đầu. Cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất cho khách hàng với sản phẩm chất lượng và dịch vụ tận tâm.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Cột 2: Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 uppercase tracking-wider text-sm">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="#" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Hướng dẫn mua hàng</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Chính sách bảo hành</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Quy định đổi trả</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Giao hàng & Thanh toán</Link></li>
            </ul>
          </div>

          {/* Cột 3: Về chúng tôi */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 uppercase tracking-wider text-sm">Về KuroTech</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="#" className="hover:text-primary transition-colors">Giới thiệu công ty</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Hệ thống cửa hàng</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Tuyển dụng</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Tin tức công nghệ</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Cột 4: Thông tin liên hệ */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 uppercase tracking-wider text-sm">Liên Hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>120 Yên Lãng, Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>1900 1234 (Tổng đài 24/7)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>10a10nguyenducminh@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} KuroTech. Tất cả quyền được bảo lưu.</p>
          <p className="mt-2">Được thiết kế và phát triển với ♥ bởi KuroTeam.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
