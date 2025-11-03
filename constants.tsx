
import type { Service, Appointment, User, Promotion, Wallet, Review, TreatmentCourse, Therapist, RedeemableVoucher, PointsHistory, Tier, Mission, Payment, StaffScheduleSlot, StaffDailyAvailability, PromotionTargetAudience, RedeemedReward, StaffTier, InternalNotification, StaffShift, Product, Sale, InternalNews } from './types';

// Helper functions must be defined before they are used by mock data
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const now = new Date();

export const MOCK_SERVICES: Service[] = [
    {
        id: '1',
        name: 'Chăm Sóc Da Mặt Chuyên Sâu',
        description: 'Làm sạch, tái tạo và nuôi dưỡng làn da của bạn.',
        longDescription: 'Liệu trình chăm sóc da mặt chuyên sâu 90 phút sử dụng các sản phẩm cao cấp giúp làm sạch sâu lỗ chân lông, loại bỏ tế bào chết, cung cấp dưỡng chất và độ ẩm cần thiết. Làn da của bạn sẽ trở nên sáng mịn, tươi trẻ và đầy sức sống.',
        price: 800000,
        duration: 90,
        category: 'Facial',
        imageUrl: 'https://picsum.photos/seed/facial/400/300',
        rating: 4.8,
        reviewCount: 125,
        isNew: true,
    },
    {
        id: '2',
        name: 'Massage Thư Giãn Toàn Thân',
        description: 'Giải tỏa căng thẳng, phục hồi năng lượng.',
        longDescription: 'Trải nghiệm 60 phút massage toàn thân với tinh dầu thiên nhiên. Các động tác massage chuyên nghiệp giúp giảm đau nhức cơ bắp, cải thiện tuần hoàn máu, mang lại cảm giác thư giãn tuyệt đối cho cả cơ thể và tinh thần.',
        price: 600000,
        discountPrice: 499000,
        duration: 60,
        category: 'Massage',
        imageUrl: 'https://picsum.photos/seed/massage/400/300',
        rating: 4.9,
        reviewCount: 210,
        isHot: true,
        promoExpiryDate: '2024-12-31T23:59:59',
    },
    {
        id: '3',
        name: 'Tắm Trắng & Dưỡng Thể',
        description: 'Làn da trắng sáng, mịn màng không tì vết.',
        longDescription: 'Liệu trình tắm trắng an toàn với công nghệ hiện đại, kết hợp các dưỡng chất từ thiên nhiên giúp bật tone da rõ rệt, làm mờ các vết thâm, mang lại làn da trắng hồng, rạng rỡ. Kết thúc bằng lớp dưỡng thể khóa trắng.',
        price: 1500000,
        duration: 120,
        category: 'Body Care',
        imageUrl: 'https://picsum.photos/seed/body/400/300',
        rating: 4.7,
        reviewCount: 95,
    },
    {
        id: '4',
        name: 'Triệt Lông Công Nghệ Diode Laser',
        description: 'Loại bỏ violong hiệu quả, an toàn và không đau.',
        longDescription: 'Sử dụng công nghệ Diode Laser tiên tiến nhất để triệt lông tận gốc, an toàn cho mọi vùng da. Liệu trình nhanh chóng, không gây đau rát, giúp bạn tự tin với làn da mịn màng.',
        price: 500000,
        discountPrice: 350000,
        duration: 30,
        category: 'Hair Removal',
        imageUrl: 'https://picsum.photos/seed/laser/400/300',
        rating: 4.9,
        reviewCount: 150,
        isHot: true,
        promoExpiryDate: '2024-11-30T23:59:59',
    },
    {
        id: '5',
        name: 'Liệu Trình Trẻ Hóa Da Carbon Peel',
        description: 'Se khít lỗ chân lông và làm sáng da bằng laser carbon.',
        longDescription: 'Công nghệ laser carbon peel sử dụng than hoạt tính làm chất dẫn, giúp tia laser tác động sâu vào da, loại bỏ bụi bẩn, dầu thừa, se khít lỗ chân lông và kích thích sản sinh collagen, mang lại làn da sáng mịn và đều màu.',
        price: 2500000,
        duration: 75,
        category: 'Liệu trình đặc biệt',
        imageUrl: 'https://picsum.photos/seed/carbon/400/300',
        rating: 4.9,
        reviewCount: 78,
        isHot: true,
    },
    {
        id: '6',
        name: 'Sơn Gel & Trang Trí Móng Tay',
        description: 'Bộ móng tay xinh xắn, bền màu và độc đáo.',
        longDescription: 'Dịch vụ làm móng chuyên nghiệp bao gồm cắt da, tạo form, sơn gel cao cấp với bảng màu đa dạng và trang trí móng theo yêu cầu. Chúng tôi đảm bảo bộ móng của bạn sẽ bền đẹp và thể hiện cá tính riêng.',
        price: 350000,
        duration: 60,
        category: 'Chăm sóc móng',
        imageUrl: 'https://picsum.photos/seed/manicure/400/300',
        rating: 4.7,
        reviewCount: 110,
    },
    {
        id: '7',
        name: 'Massage Đá Nóng Thảo Dược',
        description: 'Thư giãn sâu, giảm đau nhức với đá nóng.',
        longDescription: 'Kết hợp giữa massage trị liệu và năng lượng từ đá bazan nóng, liệu trình này giúp đả thông kinh mạch, giảm co thắt cơ bắp và mang lại sự thư thái tuyệt đối. Hương thơm thảo dược nhẹ nhàng giúp bạn giải tỏa stress.',
        price: 750000,
        duration: 75,
        category: 'Massage',
        imageUrl: 'https://picsum.photos/seed/hotstone/400/300',
        rating: 4.8,
        reviewCount: 180,
        isHot: true,
    },
    {
        id: '8',
        name: 'Gói Thư Giãn Nửa Ngày "Tái Tạo"',
        description: 'Trải nghiệm spa trọn vẹn trong 4 giờ.',
        longDescription: 'Gói "Tái Tạo" bao gồm xông hơi thảo dược, tẩy tế bào chết toàn thân, massage tinh dầu và chăm sóc da mặt cơ bản. Một hành trình hoàn hảo để nuông chiều bản thân và phục hồi năng lượng.',
        price: 2200000,
        discountPrice: 1899000,
        duration: 240,
        category: 'Gói thư giãn',
        imageUrl: 'https://picsum.photos/seed/package/400/300',
        rating: 5.0,
        reviewCount: 45,
        promoExpiryDate: '2024-12-15T23:59:59',
    },
    {
        id: '9',
        name: 'Chăm Sóc Da Mụn Chuẩn Y Khoa',
        description: 'Điều trị mụn hiệu quả và ngăn ngừa tái phát.',
        longDescription: 'Liệu trình được thiết kế chuyên biệt cho da mụn, bao gồm làm sạch sâu, lấy nhân mụn an toàn, điện di tinh chất trị mụn và đắp mặt nạ kháng viêm. Giúp giảm sưng viêm, mờ thâm và ngăn mụn quay trở lại.',
        price: 950000,
        duration: 90,
        category: 'Facial',
        imageUrl: 'https://picsum.photos/seed/acne/400/300',
        rating: 4.9,
        reviewCount: 92,
    },
    {
        id: '10',
        name: 'Chăm Sóc Gót Chân Nứt Nẻ',
        description: 'Đôi chân mềm mại, mịn màng.',
        longDescription: 'Giải pháp hoàn hảo cho gót chân khô ráp, nứt nẻ. Liệu trình bao gồm ngâm chân thảo dược, loại bỏ da chết, đắp mặt nạ dưỡng ẩm và massage chân thư giãn.',
        price: 300000,
        duration: 45,
        category: 'Chăm sóc móng',
        imageUrl: 'https://picsum.photos/seed/pedicure/400/300',
        rating: 4.6,
        reviewCount: 65,
    },
    { id: '11', name: 'Ủ Tảo Xoắn Toàn Thân', description: 'Cung cấp vitamin và khoáng chất cho da.', longDescription: 'Mặt nạ tảo xoắn giàu dưỡng chất giúp thanh lọc, giải độc và cung cấp độ ẩm sâu cho làn da toàn thân, mang lại làn da căng bóng và khỏe mạnh.', price: 1200000, duration: 90, category: 'Body Care', imageUrl: 'https://picsum.photos/seed/algae/400/300', rating: 4.7, reviewCount: 58 },
    { id: '12', name: 'Triệt Lông Bikini Tạo Hình', description: 'Tự tin diện những bộ cánh gợi cảm.', longDescription: 'Dịch vụ triệt lông vùng bikini an toàn, kín đáo với công nghệ Diode Laser, giúp bạn tạo hình theo ý muốn và duy trì làn da mịn màng lâu dài.', price: 1000000, duration: 45, category: 'Hair Removal', imageUrl: 'https://picsum.photos/seed/bikini/400/300', rating: 4.9, reviewCount: 130 },
    { id: '13', name: 'Cấy Tảo Xoắn Nano', description: 'Da căng bóng, sáng khỏe tức thì.', longDescription: 'Phương pháp vi kim nano đưa tinh chất tảo xoắn vào sâu trong da, giúp phục hồi da hư tổn, làm đều màu da và tăng độ đàn hồi.', price: 1800000, duration: 90, category: 'Facial', imageUrl: 'https://picsum.photos/seed/nano/400/300', rating: 4.8, reviewCount: 88, isNew: true },
    { id: '14', name: 'Massage Cổ Vai Gáy Chuyên Sâu', description: 'Giải pháp cho dân văn phòng.', longDescription: '30 phút massage tập trung vào vùng cổ, vai, gáy giúp giảm ngay các triệu chứng đau mỏi, căng cứng cơ do ngồi làm việc nhiều.', price: 350000, duration: 30, category: 'Massage', imageUrl: 'https://picsum.photos/seed/neck/400/300', rating: 4.9, reviewCount: 250, isHot: true },
    { id: '15', name: 'Đắp Paraffin Tay/Chân', description: 'Dưỡng ẩm sâu cho da tay và chân.', longDescription: 'Ủ tay và chân trong sáp paraffin ấm giúp làm mềm da khô ráp, giảm đau khớp và mang lại cảm giác thư giãn.', price: 250000, duration: 30, category: 'Chăm sóc móng', imageUrl: 'https://picsum.photos/seed/paraffin/400/300', rating: 4.7, reviewCount: 75 },
    { id: '16', name: 'Nâng Cơ Trẻ Hóa RF', description: 'Da săn chắc, giảm nếp nhăn không xâm lấn.', longDescription: 'Sử dụng sóng RF tác động vào lớp hạ bì, kích thích tăng sinh collagen và elastin, giúp nâng cơ mặt, làm mờ nếp nhăn và trẻ hóa làn da.', price: 2000000, duration: 75, category: 'Liệu trình đặc biệt', imageUrl: 'https://picsum.photos/seed/rf/400/300', rating: 4.8, reviewCount: 65 },
    { id: '17', name: 'Gói Thư Giãn "Sảng Khoái"', description: 'Hồi phục nhanh chóng trong 90 phút.', longDescription: 'Gói "Sảng Khoái" bao gồm massage chân, massage đầu và massage cổ vai gáy, giúp bạn nhanh chóng xua tan mệt mệt mỏi và lấy lại tinh thần.', price: 900000, duration: 90, category: 'Gói thư giãn', imageUrl: 'https://picsum.photos/seed/relax/400/300', rating: 4.9, reviewCount: 80 },
    { id: '18', name: 'Tẩy Tế Bào Chết Cà Phê Dừa', description: 'Làn da mịn màng và thơm ngát.', longDescription: 'Hỗn hợp cà phê và dừa tự nhiên giúp loại bỏ lớp da chết sần sùi, cải thiện lưu thông máu, mang lại làn da sáng mịn và mềm mại.', price: 450000, duration: 45, category: 'Body Care', imageUrl: 'https://picsum.photos/seed/coffee/400/300', rating: 4.7, reviewCount: 115 },
    { id: '19', name: 'Triệt Lông Toàn Chân', description: 'Đôi chân nuột nà, không tì vết.', longDescription: 'Liệu trình triệt lông toàn bộ hai chân bằng công nghệ Diode Laser, mang lại hiệu quả lâu dài, an toàn và giúp bạn tự tin khoe dáng.', price: 2500000, duration: 60, category: 'Hair Removal', imageUrl: 'https://picsum.photos/seed/legs/400/300', rating: 4.8, reviewCount: 99 },
    { id: '20', name: 'Điện Di Vitamin C', description: 'Làm sáng da, mờ thâm nám.', longDescription: 'Sử dụng dòng điện một chiều để đưa Vitamin C vào sâu trong da, giúp ức chế melanin, làm sáng da, mờ vết thâm và chống oxy hóa.', price: 700000, duration: 60, category: 'Facial', imageUrl: 'https://picsum.photos/seed/vitaminc/400/300', rating: 4.7, reviewCount: 105 },
    { id: '21', name: 'Massage Chân Bấm Huyệt', description: 'Phục hồi sức khỏe từ đôi bàn chân.', longDescription: 'Kỹ thuật bấm huyệt chuyên sâu vào các huyệt đạo ở lòng bàn chân giúp cải thiện tuần hoàn, giảm stress và tăng cường sức khỏe tổng thể.', price: 400000, duration: 45, category: 'Massage', imageUrl: 'https://picsum.photos/seed/footreflex/400/300', rating: 4.8, reviewCount: 165 },
    { id: '22', name: 'Nối Mi Classic', description: 'Đôi mắt long lanh, tự nhiên.', longDescription: 'Kỹ thuật nối mi từng sợi một, tạo hiệu ứng hàng mi dài, cong và dày hơn nhưng vẫn giữ được vẻ đẹp tự nhiên, nhẹ nhàng.', price: 450000, duration: 90, category: 'Liệu trình đặc biệt', imageUrl: 'https://picsum.photos/seed/eyelash/400/300', rating: 4.7, reviewCount: 95 },
    { id: '23', name: 'Sơn Thường OPI', description: 'Thay đổi màu móng nhanh chóng.', longDescription: 'Dành cho những ai yêu thích sự thay đổi, dịch vụ sơn móng với các sản phẩm OPI chính hãng, lên màu chuẩn và nhanh khô.', price: 150000, duration: 30, category: 'Chăm sóc móng', imageUrl: 'https://picsum.photos/seed/opi/400/300', rating: 4.5, reviewCount: 85 },
    { id: '24', name: 'Gói Chăm Sóc Mẹ Bầu', description: 'Giảm đau nhức, thư giãn cho mẹ.', longDescription: 'Liệu trình massage được thiết kế đặc biệt cho phụ nữ mang thai, giúp giảm đau lưng, phù nề và mang lại cảm giác thư thái, an toàn cho cả mẹ và bé.', price: 800000, duration: 75, category: 'Gói thư giãn', imageUrl: 'https://picsum.photos/seed/pregnant/400/300', rating: 5.0, reviewCount: 70, isHot: true },
    { id: '25', name: 'Hút Chì Thải Độc Da', description: 'Thanh lọc làn da xỉn màu.', longDescription: 'Công nghệ hút chì sử dụng sóng siêu âm để loại bỏ độc tố, bụi bẩn và kim loại nặng tích tụ trong da, trả lại làn da sáng khỏe, hồng hào.', price: 650000, duration: 60, category: 'Facial', imageUrl: 'https://picsum.photos/seed/detox/400/300', rating: 4.6, reviewCount: 93 },
    { id: '26', name: 'Triệt Lông Nách', description: 'Vùng da dưới cánh tay mịn màng, sáng màu.', longDescription: 'Dứt điểm violong vùng nách chỉ sau một liệu trình với Diode Laser, giúp bạn tự tin và thoải mái trong mọi hoạt động.', price: 300000, discountPrice: 199000, duration: 20, category: 'Hair Removal', imageUrl: 'https://picsum.photos/seed/underarm/400/300', rating: 4.9, reviewCount: 310 },
    { id: '27', name: 'Tắm Dưỡng Sữa Non', description: 'Da mềm mại như da em bé.', longDescription: 'Ngâm mình trong bồn sữa non giàu protein và vitamin giúp nuôi dưỡng làn da khô trở nên mềm mại, mịn màng và trắng sáng.', price: 900000, duration: 75, category: 'Body Care', imageUrl: 'https://picsum.photos/seed/milk/400/300', rating: 4.8, reviewCount: 68 },
    { id: '28', name: 'Massage Thái Truyền Thống', description: 'Kéo giãn cơ thể, tăng sự linh hoạt.', longDescription: 'Một hình thức massage độc đáo sử dụng các ống tre được làm ấm để lăn, miết sâu vào các cơ bắp, giúp giải tỏa căng cơ và đả thông kinh mạch hiệu quả.', price: 700000, duration: 60, category: 'Massage', imageUrl: 'https://picsum.photos/seed/thai/400/300', rating: 4.7, reviewCount: 140 },
    { id: '29', name: 'Gội Đầu Dưỡng Sinh', description: 'Thư giãn da đầu, giảm rụng tóc.', longDescription: 'Kết hợp gội đầu bằng thảo dược và massage bấm huyệt vùng đầu, cổ, vai, gáy giúp làm sạch sâu, cải thiện tuần hoàn máu và mang lại giấc ngủ ngon.', price: 400000, duration: 60, category: 'Liệu trình đặc biệt', imageUrl: 'https://picsum.photos/seed/hairwash/400/300', rating: 4.9, reviewCount: 195, isNew: true },
    { id: '30', name: 'Úp Móng Nghệ Thuật', description: 'Thay đổi kiểu dáng móng tay tức thì.', longDescription: 'Dịch vụ úp móng giả với nhiều form dáng thời thượng, kết hợp trang trí và sơn gel theo xu hướng mới nhất.', price: 450000, duration: 75, category: 'Chăm sóc móng', imageUrl: 'https://picsum.photos/seed/nailart/400/300', rating: 4.8, reviewCount: 82 },
    { id: '31', name: 'Gói Phục Hồi Sau Sinh', description: 'Lấy lại vóc dáng và vẻ đẹp cho mẹ.', longDescription: 'Liệu trình 3 giờ bao gồm quấn nóng bụng, massage giảm mỡ, chăm sóc da mặt và xông hơi, giúp các mẹ nhanh chóng phục hồi sức khỏe và vóc dáng.', price: 1800000, duration: 120, category: 'Gói thư giãn', imageUrl: 'https://picsum.photos/seed/postpartum/400/300', rating: 4.9, reviewCount: 55 },
    { id: '32', name: 'Chạy Oxy Jet Tươi', description: 'Cấp ẩm tức thì cho da.', longDescription: 'Công nghệ Oxy Jet sử dụng áp suất cao để đẩy oxy tinh khiết và dưỡng chất vào sâu trong da, giúp da ngậm nước, căng bóng và đầy sức sống.', price: 750000, duration: 60, category: 'Facial', imageUrl: 'https://picsum.photos/seed/oxygen/400/300', rating: 4.8, reviewCount: 112 },
    { id: '33', name: 'Triệt Lông Toàn Tay', description: 'Đôi tay mịn màng, tự tin.', longDescription: 'Loại bỏ hoàn toàn lông trên hai cánh tay với công nghệ Diode Laser an toàn và hiệu quả, giúp bạn sở hữu làn da láng mịn.', price: 2000000, duration: 50, category: 'Hair Removal', imageUrl: 'https://picsum.photos/seed/arms/400/300', rating: 4.8, reviewCount: 91 },
    { id: '34', name: 'Tẩy Da Chết Muối Khoáng', description: 'Loại bỏ da chết, làm sáng da.', longDescription: 'Hỗn hợp cà phê và dừa tự nhiên giúp loại bỏ lớp da chết sần sùi, cải thiện lưu thông máu, mang lại làn da sáng mịn và mềm mại.', price: 400000, duration: 45, category: 'Body Care', imageUrl: 'https://picsum.photos/seed/salt/400/300', rating: 4.6, reviewCount: 101 },
    { id: '35', name: 'Massage Thụy Điển', description: 'Xoa dịu cơ bắp, thư giãn nhẹ nhàng.', longDescription: 'Kỹ thuật massage cổ điển của Thụy Điển với các động tác xoa bóp, miết dài nhẹ nhàng, giúp cải thiện tuần hoàn máu và giảm căng thẳng hiệu quả.', price: 650000, duration: 60, category: 'Massage', imageUrl: 'https://picsum.photos/seed/swedish/400/300', rating: 4.7, reviewCount: 135 },
    { id: '36', name: 'Phun Mày Ombre', description: 'Dáng mày thanh tú, tự nhiên như thật.', longDescription: 'Công nghệ phun mày tạo hiệu ứng chuyển màu từ nhạt sang đậm, mang lại cặp chân mày sắc nét nhưng vẫn mềm mại, tự nhiên.', price: 300000, duration: 120, category: 'Liệu trình đặc biệt', imageUrl: 'https://picsum.photos/seed/brows/400/300', rating: 4.9, reviewCount: 108 },
    { id: '37', name: 'Gói "Detox" Toàn Diện', description: 'Thanh lọc cơ thể và làn da.', longDescription: 'Liệu trình 3 giờ bao gồm xông hơi, tẩy tế bào chết, ủ bùn khoáng và massage thải độc, giúp cơ thể loại bỏ độc tố và tái tạo năng lượng.', price: 1900000, duration: 180, category: 'Gói thư giãn', imageUrl: 'https://picsum.photos/seed/fulldetox/400/300', rating: 4.8, reviewCount: 60 },
    { id: '38', name: 'Liệu Trình Vitamin A - Retinol', description: 'Chống lão hóa, làm mờ nếp nhăn.', longDescription: 'Ứng dụng Retinol chuyên nghiệp giúp thúc đẩy quá trình tái tạo tế bào, làm mờ nếp nhăn, cải thiện cấu trúc da và chống lại các dấu hiệu lão hóa.', price: 1600000, duration: 75, category: 'Facial', imageUrl: 'https://picsum.photos/seed/retinol/400/300', rating: 4.9, reviewCount: 77 },
    { id: '39', name: 'Triệt Ria Mép', description: 'Gương mặt sáng và mịn màng hơn.', longDescription: 'Giải quyết vùng ria mép kém duyên một cách nhanh chóng và an toàn bằng công nghệ Diode Laser, không gây đau rát hay thâm sạm.', price: 200000, duration: 15, category: 'Hair Removal', imageUrl: 'https://picsum.photos/seed/mustache/400/300', rating: 4.8, reviewCount: 121 },
    { id: '40', name: 'Đính Đá Móng Tay', description: 'Thêm điểm nhấn lấp lánh cho bộ móng.', longDescription: 'Dịch vụ đính đá, pha lê và các phụ kiện trang trí khác lên móng tay, tạo nên một tác phẩm nghệ thuật độc đáo và thu hút.', price: 150000, duration: 30, category: 'Chăm sóc móng', imageUrl: 'https://picsum.photos/seed/rhinestone/400/300', rating: 4.7, reviewCount: 94 },
    { id: '41', name: 'Giảm Béo Bụng Công Nghệ Cao', description: 'Đánh tan mỡ thừa, định hình vòng eo.', longDescription: 'Sử dụng công nghệ sóng siêu âm hội tụ để phá hủy các mô mỡ cứng đầu ở vùng bụng, giúp vòng eo thon gọn và săn chắc hơn mà không cần phẫu thuật.', price: 2800000, duration: 90, category: 'Body Care', imageUrl: 'https://picsum.photos/seed/slim/400/300', rating: 4.8, reviewCount: 83, isHot: true },
    { id: '42', name: 'Massage Tre', description: 'Đả thông kinh mạch bằng ống tre.', longDescription: 'Một hình thức massage độc đáo sử dụng các ống tre được làm ấm để lăn, miết sâu vào các cơ bắp, giúp giải tỏa căng cơ và đả thông kinh mạch hiệu quả.', price: 800000, duration: 75, category: 'Massage', imageUrl: 'https://picsum.photos/seed/bamboo/400/300', rating: 4.7, reviewCount: 71 },
    { id: '43', name: 'Khử Thâm Môi', description: 'Đôi môi hồng hào, tươi tắn.', longDescription: 'Công nghệ laser chuyên dụng giúp loại bỏ các sắc tố melanin gây thâm sạm, trả lại cho bạn đôi môi hồng hào, tự nhiên và quyến rũ.', price: 1500000, duration: 60, category: 'Liệu trình đặc biệt', imageUrl: 'https://picsum.photos/seed/lips/400/300', rating: 4.8, reviewCount: 96 },
    { id: '44', name: 'Liệu Trình Phục Hồi Da Nhạy Cảm', description: 'Làm dịu và củng cố hàng rào bảo vệ da.', longDescription: 'Thiết kế đặc biệt cho làn da yếu, nhạy cảm, liệu trình sử dụng các sản phẩm dịu nhẹ, không hương liệu kết hợp điện di lạnh để giảm kích ứng và phục hồi da.', price: 900000, duration: 75, category: 'Facial', imageUrl: 'https://picsum.photos/seed/sensitive/400/300', rating: 4.9, reviewCount: 115 },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
    // Today's appointments
    { id: 'apt_today1', serviceId: '2', serviceName: 'Massage Thư Giãn Toàn Thân', userId: 'user123', date: formatDate(now), time: '14:00', status: 'upcoming', therapist: 'Trần Thị Lan', therapistId: 'staff-lan' },
    { id: 'apt_today2', serviceId: '1', serviceName: 'Chăm Sóc Da Mặt Chuyên Sâu', userId: 'user125', date: formatDate(now), time: '16:00', status: 'upcoming', therapist: 'Phạm Thị Mai', therapistId: 'staff-mai' },
    { id: 'apt_today3', serviceId: '14', serviceName: 'Massage Cổ Vai Gáy Chuyên Sâu', userId: 'user124', date: formatDate(now), time: '17:00', status: 'upcoming', therapist: 'Trần Thị Lan', therapistId: 'staff-lan' },
    { id: 'apt_pending2', serviceId: '29', serviceName: 'Gội Đầu Dưỡng Sinh', userId: 'user123', date: formatDate(now), time: '18:00', status: 'pending', therapist: 'Phạm Thị Mai', therapistId: 'staff-mai' },
    { id: 'apt_inprogress1', serviceId: '5', serviceName: 'Liệu Trình Trẻ Hóa Da Carbon Peel', userId: 'user123', date: formatDate(now), time: '10:00', status: 'in-progress', therapist: 'Phạm Thị Mai', therapistId: 'staff-mai', room: 'Phòng 1', notesForTherapist: 'Khách hàng có da nhạy cảm nhẹ.' },
    { id: 'apt_completed_today', serviceId: '18', serviceName: 'Tẩy Tế Bào Chết Cà Phê Dừa', userId: 'user124', date: formatDate(now), time: '11:00', status: 'completed', therapist: 'Trần Thị Lan', therapistId: 'staff-lan', staffNotesAfterSession: 'Khách hàng rất thích mùi hương cà phê, hẹn buổi sau.' },


    // Upcoming appointments
    { id: 'apt_up1', serviceId: '4', serviceName: 'Triệt Lông Công Nghệ Diode Laser', userId: 'user123', date: formatDate(addDays(now, 1)), time: '10:00', status: 'upcoming', therapist: 'Phạm Thị Mai', therapistId: 'staff-mai' },
    { id: 'apt_pending1', serviceId: '9', serviceName: 'Chăm Sóc Da Mụn Chuẩn Y Khoa', userId: 'user124', date: formatDate(addDays(now, 2)), time: '14:00', status: 'pending', therapist: 'Trần Thị Lan', therapistId: 'staff-lan' },
    { id: 'apt_up2', serviceId: '7', serviceName: 'Massage Đá Nóng Thảo Dược', userId: 'user125', date: formatDate(addDays(now, 3)), time: '11:00', status: 'upcoming', therapist: 'Phạm Thị Mai', therapistId: 'staff-mai' },
    
    // Past appointments (this month)
    { id: 'apt_past_m1', serviceId: '5', serviceName: 'Liệu Trình Trẻ Hóa Da Carbon Peel', userId: 'user123', date: formatDate(addDays(now, -5)), time: '13:00', status: 'completed', therapist: 'Trần Thị Lan', therapistId: 'staff-lan' },
    { id: 'apt_past_m2', serviceId: '6', serviceName: 'Sơn Gel & Trang Trí Móng Tay', userId: 'user124', date: formatDate(addDays(now, -10)), time: '15:00', status: 'completed', therapist: 'Phạm Thị Mai', therapistId: 'staff-mai' },
    { id: 'apt_past_m3', serviceId: '2', serviceName: 'Massage Thư Giãn Toàn Thân', userId: 'user125', date: formatDate(addDays(now, -12)), time: '17:00', status: 'cancelled', therapist: 'Trần Thị Lan', therapistId: 'staff-lan' },

    // Past appointments (last month)
    { id: 'apt_past_lm1', serviceId: '8', serviceName: 'Gói Thư Giãn Nửa Ngày "Tái Tạo"', userId: 'user123', date: formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 15)), time: '10:00', status: 'completed', therapist: 'Trần Thị Lan', therapistId: 'staff-lan' },
    { id: 'apt_past_lm2', serviceId: '1', serviceName: 'Chăm Sóc Da Mặt Chuyên Sâu', userId: 'user125', date: formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 20)), time: '14:00', status: 'completed', therapist: 'Phạm Thị Mai', therapistId: 'staff-mai' },

    // Past appointments (2 months ago)
    { id: 'apt_past_2m1', serviceId: '2', serviceName: 'Massage Thư Giãn Toàn Thân', userId: 'user123', date: formatDate(new Date(now.getFullYear(), now.getMonth() - 2, 10)), time: '16:00', status: 'completed', therapist: 'Trần Thị Lan', therapistId: 'staff-lan' },
];

export const MOCK_PAYMENTS: Payment[] = (() => {
    const payments: Payment[] = MOCK_APPOINTMENTS.filter(app => app.status === 'completed' || app.status === 'upcoming').slice(0, 15).map((app, index) => {
        const service = MOCK_SERVICES.find(s => s.id === app.serviceId);
        const methods: Payment['method'][] = ['Card', 'Momo', 'Cash', 'VNPay', 'ZaloPay'];
        
        const status = app.status === 'completed' 
            ? (index % 5 === 0 ? 'Refunded' : 'Completed') 
            : 'Pending';

        return {
            id: `pay_${app.id}`,
            transactionId: `ATSPA${Math.floor(100000 + Math.random() * 900000)}`,
            userId: app.userId,
            appointmentId: app.id,
            serviceName: app.serviceName,
            amount: service?.discountPrice || service?.price || 0,
            method: methods[index % methods.length],
            status: status,
            // FIX: Ensure date is correctly formatted as ISO string, 2 hours after app.date.
            date: new Date(new Date(app.date).getTime() + (2 * 60 * 60 * 1000)).toISOString(),
            therapistId: app.therapistId,
        };
    });

    // Add some more mock payments for users to ensure totalSpending calculation is varied
    const additionalPayments: Payment[] = [
        { id: 'pay_extra1', transactionId: 'ATSPA900001', userId: 'user123', appointmentId: 'apt_extra1', serviceName: 'Massage Thư Giãn Toàn Thân', amount: 600000, method: 'Card', status: 'Completed', date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString() },
        { id: 'pay_extra2', transactionId: 'ATSPA900002', userId: 'user123', appointmentId: 'apt_extra2', serviceName: 'Chăm Sóc Da Mặt Chuyên Sâu', amount: 800000, method: 'Momo', status: 'Completed', date: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString() },
        { id: 'pay_extra3', transactionId: 'ATSPA900003', userId: 'user124', appointmentId: 'apt_extra3', serviceName: 'Triệt Lông Công Nghệ Diode Laser', amount: 500000, method: 'Cash', status: 'Completed', date: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString() },
        { id: 'pay_extra4', transactionId: 'ATSPA900004', userId: 'user125', appointmentId: 'apt_extra4', serviceName: 'Gói Thư Giãn Nửa Ngày "Tái Tạo"', amount: 1899000, method: 'Card', status: 'Completed', date: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString() },
    ];

    return [...payments, ...additionalPayments];
})();


const calculateUserTotalSpending = (userId: string): number => {
    return MOCK_PAYMENTS
        .filter(p => p.userId === userId && p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);
};

export const MOCK_USER: User = {
    id: 'user-admin',
    name: 'Admin',
    email: 'admin123@gmail.com',
    password: 'admin123',
    phone: '098-765-4321',
    profilePictureUrl: 'https://picsum.photos/seed/admin/200/200',
    joinDate: '2023-01-01',
    birthday: `01-01`, 
    tierLevel: 8,
    selfCareIndex: 100,
    gender: 'Nam',
    isAdmin: true,
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    totalSpending: calculateUserTotalSpending('user-admin'), // Admin spending for consistency
    lastTierUpgradeDate: '2023-01-01T00:00:00Z',
};

export const MOCK_USERS: User[] = [
  MOCK_USER,
  {
    id: 'user123',
    name: 'Nguyễn Thị An',
    email: 'an.nguyen@example.com',
    password: 'password123',
    phone: '090-123-4567',
    profilePictureUrl: 'https://picsum.photos/seed/user1/200/200',
    // FIX: Ensured joinDate and lastLogin are correctly formatted ISO strings
    joinDate: new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split('T')[0],
    birthday: '11-02',
    tierLevel: 3,
    selfCareIndex: 85,
    gender: 'Nữ',
    isAdmin: false,
    role: 'Client',
    status: 'Active',
    lastLogin: new Date(now.setDate(now.getDate() - 1)).toISOString(),
    loginHistory: [
        { date: new Date().toISOString(), ip: '192.168.1.1', device: 'Chrome on Windows', isUnusual: false },
        { date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), ip: '10.0.0.1', device: 'Safari on iPhone', isUnusual: true },
    ],
    totalSpending: calculateUserTotalSpending('user123'),
    lastTierUpgradeDate: '2024-06-01T00:00:00Z',
  },
  {
    id: 'user124',
    name: 'Trần Văn Bình',
    email: 'binh.tran@example.com',
    password: 'password123',
    phone: '091-234-5678',
    profilePictureUrl: 'https://picsum.photos/seed/user2/200/200',
    // FIX: Ensured joinDate and lastLogin are correctly formatted ISO strings
    joinDate: new Date().toISOString().split('T')[0],
    birthday: '05-20',
    tierLevel: 1,
    selfCareIndex: 60,
    gender: 'Nam',
    isAdmin: false,
    role: 'Client',
    status: 'Inactive',
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    totalSpending: calculateUserTotalSpending('user124'),
    lastTierUpgradeDate: new Date().toISOString(),
  },
   {
    id: 'user125',
    name: 'Lê Hoàng Cúc',
    email: 'cuc.le@example.com',
    password: 'password123',
    phone: '092-345-6789',
    profilePictureUrl: 'https://picsum.photos/seed/user3/200/200',
    // FIX: Ensured joinDate and lastLogin are correctly formatted ISO strings
    joinDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
    birthday: '09-15',
    tierLevel: 2,
    selfCareIndex: 75,
    gender: 'Nữ',
    isAdmin: false,
    role: 'Client',
    status: 'Locked',
    lastLogin: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    totalSpending: calculateUserTotalSpending('user125'),
    lastTierUpgradeDate: '2024-07-01T00:00:00Z',
  },
  {
    id: 'staff-mai',
    name: 'Phạm Thị Mai',
    email: 'mai.pham@anhthospa.vn',
    password: 'password123',
    phone: '093-111-2222',
    profilePictureUrl: 'https://picsum.photos/seed/team1/300/300',
    // FIX: Ensured joinDate and lastLogin are correctly formatted ISO strings
    joinDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
    birthday: '03-08',
    tierLevel: 1, // Staff don't have tiers, but keep for type consistency
    selfCareIndex: 0,
    gender: 'Nữ',
    isAdmin: false,
    role: 'Technician',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    specialty: ['Chăm sóc da', 'Triệt lông'], // Changed to array
    experience: '5 năm kinh nghiệm trong chăm sóc da chuyên sâu và ứng dụng công nghệ laser.',
    totalSpending: 0,
    lastTierUpgradeDate: new Date().toISOString(),
    staffTier: 'Thành thạo',
    commissionRate: 0.15,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=staff-mai'
  },
  {
    id: 'staff-lan',
    name: 'Trần Thị Lan',
    email: 'lan.tran@anhthospa.vn',
    password: 'password123',
    phone: '093-222-3333',
    profilePictureUrl: 'https://picsum.photos/seed/team2/300/300',
    // FIX: Ensured joinDate and lastLogin are correctly formatted ISO strings
    joinDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split('T')[0],
    birthday: '07-12',
    tierLevel: 1,
    selfCareIndex: 0,
    gender: 'Nữ',
    isAdmin: false,
    role: 'Technician',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    specialty: ['Massage trị liệu', 'Body care'], // Changed to array
    experience: '7 năm kinh nghiệm trong các liệu pháp massage thư giãn và trị liệu, chăm sóc cơ thể toàn diện.',
    totalSpending: 0,
    lastTierUpgradeDate: new Date().toISOString(),
    staffTier: 'Chuyên gia',
    commissionRate: 0.20,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=staff-lan'
  },
  {
    id: 'staff-tuan',
    name: 'Hoàng Văn Tuấn',
    email: 'tuan.hoang@anhthospa.vn',
    password: 'password123',
    phone: '094-222-3333',
    profilePictureUrl: 'https://picsum.photos/seed/team3/300/300',
    // FIX: Ensured joinDate and lastLogin are correctly formatted ISO strings
    joinDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    birthday: '07-12',
    tierLevel: 1,
    selfCareIndex: 0,
    gender: 'Nam',
    isAdmin: false,
    role: 'Receptionist',
    status: 'Active',
    lastLogin: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
    specialty: ['Quản lý lịch hẹn', 'Tư vấn khách hàng'], // Changed to array
    experience: '2 năm kinh nghiệm ở vị trí lễ tân, xử lý đặt lịch và tư vấn.',
    totalSpending: 0,
    lastTierUpgradeDate: new Date().toISOString(),
    staffTier: 'Mới',
    commissionRate: 0.05,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=staff-tuan'
  },
  {
    id: 'staff-huong',
    name: 'Lê Thu Hương',
    email: 'huong.le@anhthospa.vn',
    password: 'password123',
    phone: '093-444-5555',
    profilePictureUrl: 'https://picsum.photos/seed/team4/300/300',
    // FIX: Ensured joinDate and lastLogin are correctly formatted ISO strings
    joinDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
    birthday: '04-20',
    tierLevel: 1,
    selfCareIndex: 0,
    gender: 'Nữ',
    isAdmin: false,
    role: 'Manager',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    specialty: ['Quản lý vận hành', 'Đào tạo nhân sự'], // Changed to array
    experience: '8 năm kinh nghiệm trong ngành spa, 3 năm ở vị trí quản lý.',
    totalSpending: 0,
    lastTierUpgradeDate: new Date().toISOString(),
    staffTier: 'Chuyên gia',
    commissionRate: 0.10,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=staff-huong'
  }
];

export const MOCK_PROMOTIONS: Promotion[] = [
    {
        id: 'promo1',
        title: 'Giảm 20% cho lần đầu trải nghiệm',
        description: 'Nhận ngay ưu đãi 20% cho bất kỳ dịch vụ nào trong lần đầu tiên đến với Anh Thơ Spa.',
        code: 'WELCOME20',
        expiryDate: addDays(now, 60).toISOString(), // 60 days from now
        imageUrl: 'https://picsum.photos/seed/promo1/500/300',
        discountType: 'percentage',
        discountValue: 20,
        termsAndConditions: 'Áp dụng cho khách hàng mới. Không áp dụng đồng thời với các chương trình khuyến mãi khác. Không có giá trị quy đổi thành tiền mặt.',
        targetAudience: 'New Clients', // New field
        applicableServiceIds: [], // Applies to all services
        minOrderValue: 0,
        usageCount: 15,
    },
    {
        id: 'promo2',
        title: 'Đi 2 tính tiền 1 (Giảm 50%)',
        description: 'Rủ bạn bè cùng đi làm đẹp, ưu đãi đặc biệt cho các cặp đôi bạn thân.',
        code: 'FRIENDSHIP',
        expiryDate: addDays(now, 20).toISOString(), // 20 days from now
        imageUrl: 'https://picsum.photos/seed/promo2/500/300',
        discountType: 'percentage',
        discountValue: 50,
        termsAndConditions: 'Áp dụng cho cùng một dịch vụ trong cùng một lần thanh toán. Áp dụng cho 2 khách hàng.',
        targetAudience: 'All',
        applicableServiceIds: [],
        minOrderValue: 0,
        usageCount: 30,
    },
    {
        id: 'promo3',
        title: 'Giảm 30% Gói Massage Toàn Thân',
        description: 'Thư giãn tuyệt đối với gói massage đặc biệt, nay chỉ còn 70% giá gốc.',
        code: 'RELAX30',
        expiryDate: addDays(now, 5).toISOString(), // 5 days from now
        imageUrl: 'https://picsum.photos/seed/promo3/500/300',
        discountType: 'percentage',
        discountValue: 30,
        termsAndConditions: 'Chỉ áp dụng cho các dịch vụ Massage trong danh mục. Vui lòng đặt lịch trước.',
        targetAudience: 'All',
        applicableServiceIds: MOCK_SERVICES.filter(s => s.category === 'Massage').map(s => s.id), // Specific services
        minOrderValue: 500000,
        usageCount: 50,
    },
    {
        id: 'promo4',
        title: 'Giảm ngay 100.000đ',
        description: 'Nhập mã để được giảm ngay 100.000đ trên tổng hóa đơn.',
        code: 'GIAM100K',
        expiryDate: addDays(now, 90).toISOString(), // 90 days from now
        imageUrl: 'https://picsum.photos/seed/promo4/500/300',
        discountType: 'fixed',
        discountValue: 100000,
        termsAndConditions: 'Áp dụng cho hóa đơn từ 500.000đ trở lên. Mỗi khách hàng chỉ được sử dụng một lần.',
        targetAudience: 'All',
        applicableServiceIds: [],
        minOrderValue: 500000,
        usageCount: 22,
    },
    {
        id: 'promo5',
        title: 'Ưu đãi sinh nhật - Voucher 20%',
        description: 'Mừng sinh nhật khách hàng thân thiết, Anh Thơ Spa gửi tặng voucher giảm giá 20% cho dịch vụ bất kỳ.',
        code: 'HAPPYBDAY',
        expiryDate: addDays(now, 30).toISOString(), // 30 days from now
        imageUrl: 'https://picsum.photos/seed/promo-bday/500/300',
        discountType: 'percentage',
        discountValue: 20,
        termsAndConditions: 'Áp dụng trong tháng sinh nhật của khách hàng. Vui lòng xuất trình CCCD khi sử dụng.',
        targetAudience: 'Birthday', // New type of audience
        applicableServiceIds: [],
        minOrderValue: 0,
        usageCount: 8,
    },
    {
        id: 'promo6',
        title: 'Combo Facial & Body Massage - Giảm 15%',
        description: 'Trọn gói thư giãn với chăm sóc da mặt và massage toàn thân, tiết kiệm đến 15%.',
        code: 'COMBOBEAUTY',
        expiryDate: addDays(now, 45).toISOString(), // 45 days from now
        imageUrl: 'https://picsum.photos/seed/promo-combo/500/300',
        discountType: 'percentage',
        discountValue: 15,
        termsAndConditions: 'Áp dụng cho gói combo Facial & Body Massage. Không tách lẻ dịch vụ.',
        targetAudience: 'All',
        applicableServiceIds: ['1', '2'], // Example: Chăm Sóc Da Mặt Chuyên Sâu (1), Massage Thư Giãn Toàn Thân (2)
        minOrderValue: 0,
        usageCount: 18,
    },
    {
        id: 'promo7',
        title: 'Quà tặng Serum dưỡng da cao cấp',
        description: 'Tặng kèm Serum dưỡng da cao cấp khi sử dụng liệu trình Trẻ hóa da Carbon Peel.',
        code: 'SERUMGIFT',
        expiryDate: addDays(now, 10).toISOString(), // 10 days from now
        imageUrl: 'https://picsum.photos/seed/promo-gift/500/300',
        discountType: 'fixed', // Representing a gift as a fixed discount for now
        discountValue: 0, // Zero discount, implies a free gift
        termsAndConditions: 'Chỉ áp dụng khi sử dụng dịch vụ "Liệu Trình Trẻ Hóa Da Carbon Peel". Quà tặng có giới hạn.',
        targetAudience: 'All',
        applicableServiceIds: ['5'], // Liệu Trình Trẻ Hóa Da Carbon Peel
        minOrderValue: 0,
        usageCount: 7,
    },
    {
        id: 'promo8',
        title: 'Ưu đãi độc quyền hạng Kim Cương - Giảm 25%',
        description: 'Khách hàng hạng Kim Cương nhận ngay ưu đãi 25% cho tất cả dịch vụ cao cấp.',
        code: 'DIAMOND25',
        expiryDate: addDays(now, 60).toISOString(), // 60 days from now
        imageUrl: 'https://picsum.photos/seed/promo-vip/500/300',
        discountType: 'percentage',
        discountValue: 25,
        termsAndConditions: 'Chỉ áp dụng cho khách hàng thành viên hạng Kim Cương. Không áp dụng đồng thời với các ưu đãi khác.',
        targetAudience: 'Tier Level 5', // Example for VIP tier
        applicableServiceIds: [],
        minOrderValue: 1000000,
        usageCount: 3,
    },
];

export const MOCK_WALLET: Wallet = {
    balance: 500000,
    points: 1250,
    spinsLeft: 3,
};

export const AVAILABLE_TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
export const STANDARD_WORK_TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

// New constant for available specialties
export const AVAILABLE_SPECIALTIES: string[] = [
    'Chăm sóc da',
    'Massage trị liệu',
    'Triệt lông',
    'Body care',
    'Chăm sóc móng',
    'Liệu trình đặc biệt',
    'Quản lý lịch hẹn',
    'Tư vấn khách hàng',
    'Quản lý vận hành',
    'Đào tạo nhân sự',
    'Trang điểm',
    'Phun xăm',
];

// New constant for promotion target audiences
export const PROMOTION_TARGET_AUDIENCES: PromotionTargetAudience[] = [
    'All',
    'New Clients',
    'Birthday',
    'VIP',
    'Tier Level 1',
    'Tier Level 2',
    'Tier Level 3',
    'Tier Level 4',
    'Tier Level 5',
    'Tier Level 6',
    'Tier Level 7',
    'Tier Level 8',
];

export const MOCK_THERAPISTS: Therapist[] = [
    { 
        id: 'any', 
        name: 'Bất kỳ chuyên viên nào', 
        specialty: ['Hệ thống sẽ tự động sắp xếp'],
        imageUrl: 'https://picsum.photos/seed/any-therapist/300/300', 
        rating: 5, 
        reviewCount: 0 
    },
    { 
        id: 'staff-mai', 
        name: 'Phạm Thị Mai', 
        specialty: ['Chăm sóc da', 'Triệt lông'],
        imageUrl: 'https://picsum.photos/seed/team1/300/300', 
        rating: 4.9, 
        reviewCount: 85,
        experience: '5 năm kinh nghiệm trong chăm sóc da chuyên sâu và ứng dụng công nghệ laser.'
    },
    { 
        id: 'staff-lan', 
        name: 'Trần Thị Lan', 
        specialty: ['Massage trị liệu', 'Body care'],
        imageUrl: 'https://picsum.photos/seed/team2/300/300', 
        rating: 4.8, 
        reviewCount: 112,
        experience: '7 năm kinh nghiệm trong các liệu pháp massage thư giãn và trị liệu, chăm sóc cơ thể toàn diện.'
    },
    { 
        id: 'staff-tuan', 
        name: 'Hoàng Văn Tuấn', 
        specialty: ['Lễ tân', 'Tư vấn'],
        imageUrl: 'https://picsum.photos/seed/team3/300/300', 
        rating: 4.9, 
        reviewCount: 98,
        experience: '2 năm kinh nghiệm ở vị trí lễ tân, xử lý đặt lịch và tư vấn.'
    },
    { 
        id: 'staff-huong', 
        name: 'Lê Thu Hương', 
        specialty: ['Quản lý vận hành', 'Đào tạo nhân sự'],
        imageUrl: 'https://picsum.photos/seed/team4/300/300', 
        rating: 5.0, 
        reviewCount: 50,
        experience: '8 năm kinh nghiệm trong ngành spa, 3 năm ở vị trí quản lý.'
    }
];

export const MOCK_REVIEWS: Review[] = [
    {
        id: 'review1',
        serviceId: '2',
        userName: 'Chị Lan Anh',
        userImageUrl: 'https://picsum.photos/seed/person1/100/100',
        rating: 5,
        comment: 'Dịch vụ massage ở đây thật tuyệt vời. Tôi cảm thấy hoàn toàn thư giãn và sảng khoái. Nhân viên rất chuyên nghiệp và thân thiện.',
        date: '2024-07-28',
    },
    {
        id: 'review2',
        serviceId: '1',
        userName: 'Anh Minh',
        userImageUrl: 'https://picsum.photos/seed/person2/100/100',
        rating: 5,
        comment: 'Da mặt tôi đã cải thiện rõ rệt sau liệu trình chăm sóc chuyên sâu. Không gian spa rất sang trọng và yên tĩnh. Chắc chắn sẽ quay lại.',
        date: '2024-07-25',
    },
    {
        id: 'review3',
        serviceId: '3',
        userName: 'Bạn Thanh Trúc',
        userImageUrl: 'https://picsum.photos/seed/person3/100/100',
        rating: 4,
        comment: 'Liệu trình tắm trắng hiệu quả. Mình rất hài lòng với kết quả. Sẽ giới thiệu cho bạn bè.',
        date: '2024-07-22',
    },
    {
        id: 'review4',
        serviceId: 'apt_past_m1', // This should typically be an appointment ID
        userName: 'Nguyễn Thị An',
        userImageUrl: 'https://picsum.photos/seed/user1/100/100',
        rating: 5,
        comment: 'Rất hài lòng với liệu trình trẻ hóa da. Chuyên viên Lan rất tận tâm!',
        date: '2024-07-20',
    },
];

export const MOCK_TREATMENT_COURSES: TreatmentCourse[] = [
    {
        id: 'course1',
        serviceId: '4',
        serviceName: 'Gói Triệt Lông Diode Laser (Nách)',
        totalSessions: 6,
        sessions: [
            { date: '2024-05-10', therapist: 'Phạm Thị Mai', notes: 'Buổi 1: Da phản ứng tốt, không có dấu hiệu kích ứng. Lông rụng khoảng 20%.' },
            { date: '2024-06-05', therapist: 'Phạm Thị Mai', notes: 'Buổi 2: Lông mọc lại thưa và mỏng hơn. Tăng nhẹ mức năng lượng.' },
            { date: '2024-07-01', therapist: 'Phạm Thị Mai', notes: 'Buổi 3: Hiệu quả rõ rệt, lông giảm khoảng 60%. Khách hàng hài lòng.' },
        ],
        clientId: 'user123',
        therapistId: 'staff-mai',
        status: 'active',
    },
    {
        id: 'course2',
        serviceId: '1',
        serviceName: 'Liệu Trình Tái Tạo Da Peel (3 buổi)',
        totalSessions: 3,
        sessions: [
            { date: '2024-07-15', therapist: 'Trần Thị Lan', notes: 'Buổi 1: Peel da cấp độ nhẹ. Da hơi ửng đỏ sau khi làm, đã dặn dò khách chăm sóc tại nhà.' },
        ],
        clientId: 'user124',
        therapistId: 'staff-lan',
        status: 'active',
    },
    {
      id: 'course3',
      serviceId: '5',
      serviceName: 'Liệu Trình Trẻ Hóa Da Carbon Peel (5 buổi)',
      totalSessions: 5,
      sessions: [
          { date: '2024-06-01', therapist: 'Phạm Thị Mai', notes: 'Buổi 1: Giới thiệu liệu trình, làm sạch sâu.' },
          { date: '2024-06-15', therapist: 'Phạm Thị Mai', notes: 'Buổi 2: Bắt đầu liệu trình peel, da có vẻ sáng hơn.' },
      ],
      clientId: 'user125',
      therapistId: 'staff-mai',
      status: 'paused',
    },
];

export const MOCK_REDEEMABLE_VOUCHERS: RedeemableVoucher[] = [
    { id: 'v1', description: 'Voucher giảm giá 50.000đ cho mọi dịch vụ', pointsRequired: 500, value: 50000, applicableServiceIds: [], targetAudience: 'All' },
    { id: 'v2', description: 'Voucher giảm giá 100.000đ cho dịch vụ Facial', pointsRequired: 950, value: 100000, applicableServiceIds: MOCK_SERVICES.filter(s => s.category === 'Facial').map(s => s.id), targetAudience: 'All' },
    { id: 'v3', description: 'Voucher giảm giá 250.000đ cho khách VIP', pointsRequired: 2200, value: 250000, applicableServiceIds: [], targetAudience: 'VIP' },
    { id: 'v4', description: 'Voucher miễn phí Gội đầu Dưỡng sinh', pointsRequired: 1500, value: 400000, applicableServiceIds: ['29'], targetAudience: 'All' }, // Service ID 29 is Gội Đầu Dưỡng Sinh
    { id: 'v5', description: 'Voucher tri ân nâng hạng Đồng', pointsRequired: 0, value: 50000, applicableServiceIds: [], targetAudience: 'Tier Level 1' },
    { id: 'v6', description: 'Voucher tri ân nâng hạng Bạc', pointsRequired: 0, value: 100000, applicableServiceIds: [], targetAudience: 'Tier Level 2' },
    { id: 'v7', description: 'Voucher tri ân nâng hạng Vàng', pointsRequired: 0, value: 150000, applicableServiceIds: [], targetAudience: 'Tier Level 3' },
    { id: 'v8', description: 'Voucher tri ân nâng hạng Bạch Kim', pointsRequired: 0, value: 250000, applicableServiceIds: [], targetAudience: 'Tier Level 4' },
    { id: 'v9', description: 'Voucher tri ân nâng hạng Kim Cương', pointsRequired: 0, value: 500000, applicableServiceIds: [], targetAudience: 'Tier Level 5' },
];

export const MOCK_POINTS_HISTORY: PointsHistory[] = [
    { id: 'ph1', date: '2024-07-20', description: 'Hoàn thành dịch vụ Massage Thư Giãn', pointsChange: 600 },
    { id: 'ph2', date: '2024-07-10', description: 'Giới thiệu bạn bè thành công', pointsChange: 500 },
    { id: 'ph3', date: '2024-07-05', description: 'Đổi voucher 50.000đ', pointsChange: -500 },
    { id: 'ph4', date: '2024-06-15', description: 'Check-in tại spa', pointsChange: 50 },
    { id: 'ph5', date: '2024-06-01', description: 'Mua gói liệu trình Chăm Sóc Da', pointsChange: 600 },
];

export const MOCK_TIERS: Tier[] = [
    { level: 1, name: 'Đồng', pointsRequired: 0, minSpendingRequired: 0, color: '#CD7F32', textColor: 'text-amber-800' },
    { level: 2, name: 'Bạc', pointsRequired: 1000, minSpendingRequired: 1000000, color: '#C0C0C0', textColor: 'text-gray-500' },
    { level: 3, name: 'Vàng', pointsRequired: 5000, minSpendingRequired: 5000000, color: '#FFD700', textColor: 'text-yellow-500' },
    { level: 4, name: 'Bạch Kim', pointsRequired: 15000, minSpendingRequired: 15000000, color: '#E5E4E2', textColor: 'text-slate-400' },
    { level: 5, name: 'Kim Cương', pointsRequired: 40000, minSpendingRequired: 40000000, color: '#B9F2FF', textColor: 'text-sky-300' },
    { level: 6, name: 'SVIP', pointsRequired: 80000, minSpendingRequired: 80000000, color: '#f7b7f7', textColor: 'text-fuchsia-400'},
    { level: 7, name: 'Royal', pointsRequired: 150000, minSpendingRequired: 150000000, color: '#c7a17a', textColor: 'text-amber-600'},
    { level: 8, name: 'Infinity', pointsRequired: 300000, minSpendingRequired: 300000000, color: '#9370DB', textColor: 'text-purple-400'}
];

export const MOCK_REDEEMED_REWARDS: RedeemedReward[] = [
    { id: 'rr1', userId: 'user123', rewardDescription: 'Voucher giảm giá 50.000đ', pointsUsed: 500, dateRedeemed: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString() },
    { id: 'rr2', userId: 'user123', rewardDescription: 'Voucher miễn phí Gội đầu Dưỡng sinh', pointsUsed: 1500, dateRedeemed: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString() },
    { id: 'rr3', userId: 'user125', rewardDescription: 'Voucher giảm giá 100.000đ cho dịch vụ Facial', pointsUsed: 950, dateRedeemed: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString() },
];

export const MOCK_MISSIONS: Mission[] = [
    { id: 'm1', title: 'Đánh giá 1 dịch vụ đã hoàn thành', points: 50, isCompleted: true },
    { id: 'm2', title: 'Đặt một lịch hẹn trong tuần này', points: 100, isCompleted: false },
    { id: 'm3', title: 'Giới thiệu một người bạn thành công', points: 500, isCompleted: false },
    { id: 'm4', title: 'Check-in tại spa trên mạng xã hội', points: 150, isCompleted: false },
];


export const LUCKY_WHEEL_PRIZES = [
    { label: '50 Điểm', type: 'points', value: 50 },
    { label: 'Mất Lượt', type: 'nothing', value: 0 },
    { label: 'Voucher 10%', type: 'voucher', value: 10 },
    { label: '100 Điểm', type: 'points', value: 100 },
    { label: 'Thêm lượt', type: 'spin', value: 1 },
    { label: 'Voucher 50k', type: 'voucher_fixed', value: 50000 },
    { label: '200 Điểm', type: 'points', value: 200 },
    { label: 'Mất Lượt', type: 'nothing', value: 0 },
];

export const MOCK_STAFF_SCHEDULES: StaffScheduleSlot[] = (() => {
    const schedules: StaffScheduleSlot[] = [];
    const today = new Date();
    const daysInAdvance = 7;
    const staffIds = MOCK_USERS.filter(u => u.role === 'Technician' || u.role === 'Receptionist').map(u => u.id);

    staffIds.forEach(staffId => {
        for (let i = -3; i <= daysInAdvance; i++) { // Generate for past 3 days and next 7 days
            const date = formatDate(addDays(today, i));
            AVAILABLE_TIMES.forEach(time => {
                // Simulate some busy/available slots
                const rand = Math.random();
                if (rand > 0.3) { // 70% chance of being scheduled
                    const service = MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)];
                    schedules.push({
                        id: `sch-${staffId}-${date}-${time}`,
                        therapistId: staffId,
                        date: date,
                        time: time,
                        serviceName: service.name,
                        status: new Date(`${date}T${time}`) < today ? (rand > 0.1 ? 'completed' : 'cancelled') : 'scheduled' // Past events are completed/cancelled
                    });
                }
            });
        }
    });
    return schedules;
})();

export const MOCK_STAFF_AVAILABILITY: StaffDailyAvailability[] = (() => {
    const availability: StaffDailyAvailability[] = [];
    const today = new Date();
    const daysInAdvance = 14; // Generate availability for next 14 days
    const technicianStaffIds = MOCK_USERS.filter(u => u.role === 'Technician').map(u => u.id);

    technicianStaffIds.forEach(staffId => {
        for (let i = 0; i <= daysInAdvance; i++) {
            const date = formatDate(addDays(today, i));
            
            const timeSlots: StaffDailyAvailability['timeSlots'] = [];
            STANDARD_WORK_TIMES.forEach(time => {
                if (Math.random() > 0.1) { // 90% chance to be available
                    // Assign random services, but limit to staff's specialties if they have any
                    const staffMember = MOCK_USERS.find(u => u.id === staffId);
                    // FIX: Ensure staffSpecialties is always an array
                    const staffSpecialties = staffMember?.specialty || [];

                    const relevantServices = MOCK_SERVICES.filter(service => 
                        staffSpecialties.some(specialty => service.category.includes(specialty))
                    );

                    const availableServiceIds: string[] = [];
                    if (relevantServices.length > 0) {
                        const numServices = Math.floor(Math.random() * Math.min(relevantServices.length, 3)) + 1; // 1 to 3 random services
                        const shuffled = [...relevantServices].sort(() => 0.5 - Math.random());
                        for (let k = 0; k < numServices; k++) {
                            if (shuffled[k]) {
                                availableServiceIds.push(shuffled[k].id);
                            }
                        }
                    }

                    timeSlots.push({
                        time: time,
                        availableServiceIds: availableServiceIds
                    });
                }
            });
            
            if (timeSlots.length > 0) {
                availability.push({
                    id: `avail-${staffId}-${date}`,
                    staffId: staffId,
                    date: date,
                    timeSlots: timeSlots,
                });
            }
        }
    });
    return availability;
})();

export const MOCK_STAFF_TIERS: StaffTier[] = [
    {
      id: 'Mới',
      name: 'Mới',
      minAppointments: 0,
      minRating: 0,
      commissionBoost: 0,
      color: '#A8A29E',
      badgeImageUrl: 'https://picsum.photos/seed/staff-tier-new/50/50'
    },
    {
      id: 'Thành thạo',
      name: 'Thành thạo',
      minAppointments: 50,
      minRating: 4.0,
      commissionBoost: 0.05,
      color: '#EF4444',
      badgeImageUrl: 'https://picsum.photos/seed/staff-tier-proficient/50/50'
    },
    {
      id: 'Chuyên gia',
      name: 'Chuyên gia',
      minAppointments: 150,
      minRating: 4.7,
      commissionBoost: 0.10,
      color: '#10B981',
      badgeImageUrl: 'https://picsum.photos/seed/staff-tier-expert/50/50'
    }
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod1', name: 'Serum cấp ẩm Hyaluronic Acid', price: 550000, imageUrl: 'https://picsum.photos/seed/serum/200/200', description: 'Serum cấp ẩm sâu, giúp da căng bóng và mịn màng.', category: 'Chăm sóc da', stock: 50 },
  { id: 'prod2', name: 'Kem chống nắng SPF50+', price: 420000, imageUrl: 'https://picsum.photos/seed/sunscreen/200/200', description: 'Bảo vệ da khỏi tác hại của tia UV với chỉ số chống nắng cao.', category: 'Chăm sóc da', stock: 75 },
  { id: 'prod3', name: 'Sữa rửa mặt dịu nhẹ', price: 280000, imageUrl: 'https://picsum.photos/seed/cleanser/200/200', description: 'Làm sạch sâu nhưng vẫn giữ độ ẩm tự nhiên cho da.', category: 'Chăm sóc da', stock: 120 },
  { id: 'prod4', name: 'Mặt nạ ngủ Collagen', price: 300000, imageUrl: 'https://picsum.photos/seed/mask/200/200', description: 'Phục hồi và tái tạo da trong khi ngủ, mang lại làn da tươi trẻ.', category: 'Chăm sóc da', stock: 60 },
];

export const MOCK_SALES: Sale[] = [
  { id: 'sale1', staffId: 'staff-mai', productId: 'prod1', productName: 'Serum cấp ẩm Hyaluronic Acid', quantity: 1, totalAmount: 550000, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', clientId: 'user123' },
  { id: 'sale2', staffId: 'staff-lan', productId: 'prod3', productName: 'Sữa rửa mặt dịu nhẹ', quantity: 2, totalAmount: 560000, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed', clientId: 'user124' },
];

export const MOCK_INTERNAL_NOTIFICATIONS: InternalNotification[] = [
    {
        id: 'notif1',
        recipientId: 'staff-mai',
        recipientType: 'staff',
        type: 'appointment_new',
        message: 'Bạn có lịch hẹn mới: Chăm Sóc Da Mặt Chuyên Sâu lúc 16:00 hôm nay.',
        date: new Date().toISOString(),
        isRead: false,
        link: '/staff/appointments',
        relatedAppointmentId: 'apt_today2'
    },
    {
        id: 'notif2',
        recipientId: 'staff-lan',
        recipientType: 'staff',
        type: 'shift_change',
        message: 'Lịch làm việc ca sáng ngày mai của bạn đã được thay đổi. Vui lòng kiểm tra.',
        date: new Date().toISOString(),
        isRead: false,
        link: '/staff/schedule'
    },
    {
        id: 'notif3',
        recipientId: 'staff-mai',
        recipientType: 'staff',
        type: 'client_feedback',
        message: 'Khách hàng Nguyễn Thị An đã gửi phản hồi 5 sao cho dịch vụ bạn vừa thực hiện.',
        date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isRead: true,
        link: '/staff/customer-interaction',
        relatedAppointmentId: 'apt_past_m1'
    },
    {
      id: 'notif4',
      recipientId: 'all',
      recipientType: 'staff',
      type: 'admin_message',
      message: 'Thông báo từ quản lý: Buổi đào tạo sản phẩm mới vào 10h sáng thứ 4.',
      date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      isRead: false,
      link: '/staff/notifications'
    },
    {
      id: 'notif5',
      recipientId: 'staff-tuan',
      recipientType: 'staff',
      type: 'appointment_cancelled',
      message: 'Lịch hẹn đặt bởi user125 lúc 17:00 ngày mai đã bị hủy.',
      date: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      isRead: false,
      link: '/staff/appointments',
      relatedAppointmentId: 'apt_past_m3'
    },
    {
        id: 'notif6',
        recipientId: 'staff-mai',
        recipientType: 'staff',
        type: 'client_feedback',
        message: 'Khách hàng Trần Văn Bình đã đánh giá liệu trình của bạn 4 sao.',
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        isRead: false,
        link: '/staff/customer-interaction',
        relatedAppointmentId: 'apt_past_m2'
    },
    {
        id: 'notif7',
        recipientId: 'staff-huong',
        recipientType: 'staff',
        type: 'system_news',
        message: 'Tin nội bộ: Chính sách hoa hồng mới sẽ được áp dụng từ tháng sau.',
        date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
        isRead: false,
        link: '/staff/notifications'
    },
];

export const MOCK_INTERNAL_NEWS: InternalNews[] = [
    {
        id: 'news1',
        title: 'Ra mắt sản phẩm chăm sóc da độc quyền mới',
        content: 'Anh Thơ Spa tự hào giới thiệu dòng sản phẩm chăm sóc da độc quyền với các thành phần tự nhiên cao cấp, hứa hẹn mang lại hiệu quả vượt trội. Toàn bộ nhân viên sẽ được đào tạo vào tuần tới.',
        authorId: 'user-admin',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        priority: 'high',
    },
    {
        id: 'news2',
        title: 'Nâng cấp hệ thống đặt lịch trực tuyến',
        content: 'Chúng tôi đã hoàn tất nâng cấp hệ thống đặt lịch trực tuyến, mang lại trải nghiệm mượt mà và tiện lợi hơn cho cả khách hàng và nhân viên. Hãy khám phá ngay các tính năng mới!',
        authorId: 'staff-huong',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        priority: 'medium',
    },
];

export const MOCK_STAFF_SHIFTS: StaffShift[] = (() => {
  const shifts: StaffShift[] = [];
  const today = new Date();

  // Shifts for staff-mai
  // Today's shift (morning, approved)
  shifts.push({
    id: `shift-mai-${formatDate(today)}-morning`,
    staffId: 'staff-mai',
    date: formatDate(today),
    shiftType: 'morning',
    status: 'approved',
    shiftHours: { start: '09:00', end: '13:00' }
  });
  // Tomorrow's shift (afternoon, pending)
  shifts.push({
    id: `shift-mai-${formatDate(addDays(today, 1))}-afternoon`,
    staffId: 'staff-mai',
    date: formatDate(addDays(today, 1)),
    shiftType: 'afternoon',
    status: 'pending',
    notes: 'Yêu cầu đổi ca với Trần Thị Lan'
  });
  // Next week's shift (evening, approved)
  shifts.push({
    id: `shift-mai-${formatDate(addDays(today, 7))}-evening`,
    staffId: 'staff-mai',
    date: formatDate(addDays(today, 7)),
    shiftType: 'evening',
    status: 'approved',
  });

  // Shifts for staff-lan
  // Today's shift (afternoon, approved)
  shifts.push({
    id: `shift-lan-${formatDate(today)}-afternoon`,
    staffId: 'staff-lan',
    date: formatDate(today),
    shiftType: 'afternoon',
    status: 'approved',
    shiftHours: { start: '13:00', end: '17:00' }
  });
  // Leave request for next week
  shifts.push({
    id: `shift-lan-${formatDate(addDays(today, 5))}-leave`,
    staffId: 'staff-lan',
    date: formatDate(addDays(today, 5)),
    shiftType: 'morning',
    status: 'pending',
    notes: 'Xin nghỉ ốm',
    shiftHours: { start: '00:00', end: '00:00' } // Indicate full day leave
  });

  // Shifts for staff-tuan (receptionist)
  shifts.push({
    id: `shift-tuan-${formatDate(today)}-morning`,
    staffId: 'staff-tuan',
    date: formatDate(today),
    shiftType: 'morning',
    status: 'approved',
  });
  shifts.push({
    id: `shift-tuan-${formatDate(addDays(today, 2))}-evening`,
    staffId: 'staff-tuan',
    date: formatDate(addDays(today, 2)),
    shiftType: 'evening',
    status: 'approved',
  });

  return shifts;
})();