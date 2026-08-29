import { Book } from '../types';

const RAW_BOOKS_DATA: Book[] = [
  // TRINH THÁM (Detective / Mystery)
  {
    id: 'tt-1',
    title: 'Bóng Tối Phố Baker',
    author: 'Arthur Conan Doyle',
    category: 'TRINH THÁM',
    priceEUR: 24.00,
    priceVND: 240000,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCfxWh0sp0lzL_jUmX_W2r3Nmbq37cAx5PzRnz64HkSP-U5MbCrwaq1CzftUcLDX8uT0T9-F84I8Pm79RJn8TtpXz73_w_pD8n2rHX9YrDMqo4pYPOez0E12EGfwy1bcbAVsdhfZeAd79MoLJt-tslWZ4JXnQbwdLSk8cUTZF0SuV8LBWbJBAoiB17fRKs7TN3GxrOriyCgtVIx4kWlgz7i7Hq49Y82n0orgkLFUWXlG3SuAXnqvRR5A',
    description: 'Bóng tối bao trùm con hẻm vắng lặng phố Baker, nơi những vụ án ly kỳ chờ đón bước chân nhà thám tử lừng danh.',
    sampleChapters: {
      title: 'Chương 1: Khởi Đầu Vụ Án Phố Baker',
      page1: [
        'Bóng tối bao trùm con hẻm vắng lặng, chỉ còn tiếng mưa rơi lộp độp trên những mái tôn cũ kỹ. Hắn đứng đó, điếu thuốc cháy dở trên môi hắt ra một quầng sáng yếu ớt, soi rõ nét mặt suy tư.',
        'Đã ba ngày trôi qua kể từ khi nhận được bức thư kỳ lạ ấy. Nội dung chỉ vỏn vẹn một dòng chữ được đánh máy cẩn thận, không có chữ ký, không có địa chỉ người gửi.',
        '"Sự thật không nằm ở nơi anh vẫn tìm kiếm. Hãy đến ngã tư phố Baker vào lúc nửa đêm."'
      ],
      page2: [
        'Đồng hồ điểm đúng mười hai giờ. Tiếng chuông nhà thờ vọng lại từ xa như một lời cảnh báo mờ mịt. Hắn kéo cao cổ áo măng tô, đôi mắt đảo nhanh quan sát xung quanh. Không một bóng người.',
        'Bất chợt, một tiếng bước chân nhẹ nhàng vang lên từ phía sau lưng. Hắn quay phắt lại, bàn tay tự động trượt xuống túi áo, nơi cất giữ khẩu súng lục lạnh ngắt.',
        '"Đừng vội vàng, anh bạn," một giọng nói trầm khàn vang lên từ trong bóng tối. "Tôi không đến đây để gây sự."'
      ],
      page3: [
        'Một người đàn ông bước ra khỏi góc khuất. Ánh đèn đường le lói chiếu vào khuôn mặt góc cạnh, với vết sẹo dài chạy dọc gò má. Hắn chưa từng gặp người này trước đây.',
        '"Anh là ai? Và tại sao lại gửi bức thư đó?" hắn hỏi, giọng điệu đanh lại, vẫn giữ nguyên tư thế phòng thủ.',
        'Người đàn ông mỉm cười, một nụ cười nửa miệng đầy ẩn ý. "Tôi là ai không quan trọng. Quan trọng là tôi có thứ anh cần. Thứ mà anh đã đánh đổi cả sự nghiệp để tìm kiếm suốt năm năm qua."'
      ]
    }
  },
  {
    id: 'tt-2',
    title: 'Vết Cắt',
    author: 'Phạm Gia Bảo',
    category: 'TRINH THÁM',
    priceEUR: 22.50,
    priceVND: 225000,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChDYT25hMiy2FpGIsbsGfjKFL7ZVQwdl8wYTXz0x2XbekBq8w0tcUmJ-WSoASDTKmqXN0ZtJvvu_T9bSkb_Wv3xcwg4qCJCJJf73cFbpDfYmit78I1Y6XPsd9num7wWNXrzP-Q-6M8_8TOBvfIHsG6xq_txUl4gD0jYGv0roVzBCNaNKMoxO6VCS-Xx5dJsOhClUGDFPlZRuOL1MIKIzi52qNnDdIwSPJpZiVRb2H7Pbjqiud-6Q_OtA',
    description: 'Một tác phẩm tâm lý tội phạm u tối xoay quanh vết cắt bí ẩn làm rung chuyển cả dòng họ.',
    sampleChapters: {
      title: 'Chương 1: Giọt Máu Lạnh',
      page1: [
        'Căn phòng im lìm đến mức có thể nghe thấy tiếng giọt nước nhỏ chậm rãi từng giọt xuống chiếc chậu nhôm.',
        'Người khám nghiệm tử thi nhẹ nhàng nhấc tấm vải trắng che mặt nạn nhân. Một vết cắt sắc lẹm, hoàn hảo đến mức đáng sợ.',
        '"Kẻ ra tay phải là một chuyên gia giải phẫu, hoặc một kẻ sát nhân có tính toán cực kỳ tỉ mỉ," anh lẩm nhẩm.'
      ],
      page2: [
        'Dấu vết duy nhất còn sót lại ở hiện trường là một chiếc lông công dính vết giọt màu đỏ thẫm.',
        'Phạm Gia Bảo bước vào phòng quan sát, đôi mắt mệt mỏi nhưng sắc lẹm nhìn chằm chằm vào bản đồ các manh mối.',
        '"Mọi việc không đơn giản là trả thù cá nhân. Đây là một thông điệp."'
      ],
      page3: [
        'Cuộc điều tra dần hé lộ những bí mật động trời bị chôn giấu suốt hai mươi năm.',
        'Kẻ thù không ở đâu xa, mà lại ẩn nấp ngay trong chính những người mà nạn nhân tin tưởng nhất.',
        'Thời gian không còn nhiều khi dấu vết tiếp theo lại xuất hiện tại căn phòng của vị thẩm phán.'
      ]
    }
  },
  {
    id: 'tt-3',
    title: 'Vực Thẳm Lạnh Lẽo',
    author: 'Hoàng Minh Trạng',
    category: 'TRINH THÁM',
    priceEUR: 25.00,
    priceVND: 250000,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeoPVHaZVAKEkRGrc5_oWMAk_eYZz2ipZV1AAg52lUCFWVPeIOVHGUH3zE7ZewD8vDLSTgApI3ijH77VYF6mh-Bd0yLQF7ybV0mCUZU3fOcmSA_hvJ1jbLfLScLcqRAvuv5CDWTDGa5WgJl7RdoTjggWNnQOBDXjGuisdH9cWpyG78B4k6BfvarIkDYp6vXaT7JtiXLF1KKgynUnDGqWAltYefwolpF5yFbt5Kt3iYYCxmBR38WVDcnQ',
    description: 'Cuộc truy lùng gã sát nhân bí ẩn giữa vùng núi hẻo lánh bao phủ bởi mây mù và vách đá dốc đứng.',
    sampleChapters: {
      title: 'Chương 1: Sương Mù Vùng Cao',
      page1: [
        'Gió lạnh rít qua khe núi, mang theo hơi ẩm gắt gỏng của một buổi sáng mùa đông miền biên giới.',
        'Chiếc xe thám tử chết máy ngay chân đèo, xung quanh chỉ là vực sâu thăm thẳm ngập trong sương.',
        'Tin đồn về chuỗi mất tích kỳ lạ của những người thám hiểm lại hiện về trong tâm trí.'
      ],
      page2: [
        'Ngôi làng dưới vực sâu không hề có trên bản đồ hành chính hiện hành.',
        'Những người dân địa phương nhìn người lạ với ánh mắt e ngại và im lặng đáng sợ.',
        '"Đừng bước xuống vực sau sáu giờ tối," người trưởng bản già thì thầm rồi quay lưng đi.'
      ],
      page3: [
        'Tiếng hú đêm vang lên vọng từ hẻm đá tảng lớn khiến ai nấy đều sởn gai ốc.',
        'Bên dưới vực sâu, một ánh đèn mờ nhạt vừa được thắp lên...',
        'Hành trình đi tìm sự thật chính thức bắt đầu.'
      ]
    }
  },
  {
    id: 'tt-4',
    title: 'Bí Ấn Của Chiếc Đồng Hồ Cổ',
    author: 'Agatha Christie',
    category: 'TRINH THÁM',
    priceEUR: 21.00,
    priceVND: 210000,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPbcE1ztksqe9U7V6M_1YgHrMRmRZs-6BDvuP7nMto_0W-_5R8c1-8xHkOiRD2HB1pZJCzdhskHUyB2rBvsCQoVvsOggBK2APkp_rLBJkbBEAVY7neQO6EVIFIJwp1loKwfSwUXUdZmmTlY9-D2ND7s87rAC65fkq5xHC1pTtvVZ7hHed3Zu5W4aQrKqpaulq4KJFfRgCMoljDsxg2mXq9gqubsWxLErxKcGAWxFV1PO4N0H0VmYpE1A',
    description: 'Một vụ án hóc húa khi năm chiếc đồng hồ cổ trong căn phòng nạn nhân đều dừng đúng ở thời điểm 4 giờ 13 phút.',
    sampleChapters: {
      title: 'Chương 1: Bốn Giờ Mười Ba Phút',
      page1: [
        'Căn phòng đọc sách tràn ngập mùi da thuộc và gỗ tuyết tùng cổ kính.',
        'Trên chiếc bàn làm việc, ông lão giàu có gục xuống, tay vẫn nắm chặt chiếc chìa khóa đồng.',
        'Điều kỳ lạ duy nhất: bốn chiếc đồng hồ treo tường khác nhau đều điểm đúng 4h13.'
      ],
      page2: [
        'Người hầu gái thề rằng trước đó một giờ, trong phòng chỉ có đúng một chiếc đồng hồ duy nhất.',
        'Ai đã mang ba chiếc đồng hồ còn lại vào phòng? Và tại sao lại chỉnh chúng cùng một mốc thời gian?',
        'Thám tử nghiêng người quan sát kỹ từng bánh răng tinh xảo bên trong.'
      ],
      page3: [
        'Một mảnh giấy nhỏ giấu dưới đáy hộp nhạc phát ra giai điệu quen thuộc.',
        'Mỗi tiếng tích tắc là một manh mối đưa sự thật ra ánh sáng.',
        'Kẻ thủ ác đã tính toán chính xác tới từng giây.'
      ]
    }
  },

  // VĂN HỌC (Literature)
  {
    id: 'vh-1',
    title: 'Gió Lạnh Đầu Mùa',
    author: 'Thạch Lam',
    category: 'VĂN HỌC',
    priceEUR: 18.00,
    priceVND: 180000,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMO3iuYigtjk1EySNX3heNHOE43nAMlKZl1WQxOX7Ocd2KhjBz8qoTDeqwAKUje_nx6_ctGsM7G6aDj4WmULyD0uR_Wckuhv8_nl02YMAEWET-hOej0fcrdDYq9IT559QtmN9HBrvKbHHG08EivYCJ_v1G2Y-9iax9CFXUKW-qnA1VE_zVcrQTdZ2P1jkX9t2DPKb6Rl4WiJ9u_7ZHK_D_Z46WMw-An4GYz55WZ7qMcOvsYyE4dvLXZL8cfTp4ctLVj04',
    description: 'Tập truyện ngắn dịu dàng, ấm áp tình người trong những ngày đầu đông xứ Bắc.',
    sampleChapters: {
      title: 'Chương 1: Buổi Sáng Đầu Đông',
      page1: [
        'Sáng hôm nay, thức dậy, Sơn thấy trời rét. Cái rét đầu mùa làm anh giật mình nhẹ.',
        'Nhìn ra ngoài sân, đất khô trắng, gió bắc thổi về rì rào qua những cành lá khô.',
        'Mẹ Sơn đã dậy từ sớm, nhóm bếp lửa ấm sực cả căn nhà nhỏ.'
      ],
      page2: [
        'Sơn mặc chiếc áo bông cũ nhưng vẫn còn đủ ấm, bước ra đầu ngõ chơi cùng bạn bè.',
        'Con Hiên đứng co ro bên cột mốc, chỉ mặc chiếc áo manh tả mươi lỗ hổng.',
        'Chị Lan nhìn Sơn, hai chị em ánh mắt gặp nhau chứa đựng sự thấu hiểu lặng lẽ.'
      ],
      page3: [
        'Sơn thì thầm với chị: "Hay là chúng ta mang chiếc áo bông cũ của em Duyên cho Hiên đi?"',
        'Cái ấm áp tình người xua tan đi cái lạnh căm căm của buổi sớm đầu đông.'
      ]
    }
  },
  {
    id: 'vh-2',
    title: 'Dưới Bóng Hoa Tàn',
    author: 'Lê Phương Thảo',
    category: 'VĂN HỌC',
    priceEUR: 20.00,
    priceVND: 200000,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-84D2ndfimeOlPT2_LK8a2gWhnnYkWle5ooDMinZVSJCqLcyBg_vgAz4OAQQlX0CtRRvTseVm3oPcr9nHoQ2ObowH8IG403I-N5gAMY9gLwcsCB5orgFQcPnuCtgGJ-380EH0XypVPo9TlQyjD72Z1NWiCOsm5sW0ciu-mhIv3Mo0CLgMMP5Sg96kZ5LUZrgM7dKod2f8lpNUOzpBepmrGf7BFln31m4bANoY-MJEMxEa2NkBMcBj1w',
    description: 'Tiểu thuyết lãng mạn nhẹ nhàng xoay quanh những kỷ niệm tuổi trẻ và những đóa hoa mùa hạ.',
    sampleChapters: {
      title: 'Chương 1: Cánh Hoa Tháng Tư',
      page1: [
        'Nắng tháng Tư gieo những mệt mỏi nhẹ nhàng lên con đường rợp bóng cây xanh.',
        'Cánh hoa tàn rơi nghiêng trên trang sổ tay cũ mở dở nơi góc bàn cà phê quen thuộc.',
        'Thời gian như ngưng đọng trong từng khoảnh khắc bình yên.'
      ],
      page2: [
        'Phương Thảo nhìn ra cửa sổ, nơi những giọt mưa rào bất chợt bắt đầu rơi.',
        'Kỷ niệm mười năm trước tràn về tựa như một thước phim quay chậm.',
        'Lời hứa dưới gốc cây hoa năm ấy vẫn còn nguyên giá trị.'
      ],
      page3: [
        'Có những cuộc gặp gỡ không phải để ở bên nhau trọn đời, mà là để khắc ghi sâu sắc.',
        'Bóng hoa dù tàn, nhưng hương thơm đọng lại nơi trái tim mãi mãi.'
      ]
    }
  },
  {
    id: 'vh-3',
    title: 'The Shifting Tides',
    author: 'Eliza Vance',
    category: 'VĂN HỌC',
    priceEUR: 26.00,
    priceVND: 260000,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0OSXgiMKLi6Gw7zLxaKFJt6QyUBql8n9AID4BmbmJXYLFxlRGD5dxeC4Fj1KHAODM4-Yt9yTPSC32te5Ujm60vI40eog1JzGqId7FcWSZb9hm05gCwzaYl-KYdSpEHMuvo4eZe0W372JOmJqzWEdU_74M-rsMtspve6YJWcLR1D5GBzGp3s4v3W_QcHYBcjWYg79mIuRV95Xn2D-hFBITYr9OoSEHheyc9GfHAFzWWG94p3VlmFw-_g',
    description: 'A poetic literary novel exploring human connection and the passing of generations along the coastline.',
    sampleChapters: {
      title: 'Chapter 1: The Coastal Horizon',
      page1: [
        'The tide turned slowly under the autumn sky, leaving ripples of silver on the wet sand.',
        'Eliza stood near the old lighthouse, feeling the wind carry stories from across the Atlantic.',
        'Every wave brought a quiet reminder of choices made decades before.'
      ],
      page2: [
        'In the small wooden cottage, letters tied with dusty blue ribbon sat untouched.',
        'The handwriting was delicate, carrying words written during the turbulent summer of 1948.',
        'Some secrets are best kept by the ocean.'
      ],
      page3: [
        'As evening settled, the horizon melted into soft violet tones.',
        'A new generation learns to listen to the whispers of the shifting tides.'
      ]
    }
  },

  // Order Featured Book (Albert Camus - L'Étranger)
  {
    id: 'camus-1',
    title: "L'Étranger",
    author: 'Albert Camus',
    category: 'VĂN HỌC',
    priceEUR: 24.00,
    priceVND: 240000,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMmrVi1HZtk0j2V8SVSuMmHBIUX0oNAHwkxVKk3q0h3zQQiRNTRbE-5N5Bwuhk8a1Cy0vpDMnZrIpZrx7LYQIj41lhJ6WW0hFpMWUMS-_dCJOMUqDWgl5JD31eyoLktacAZ81q668R300goQc7QRRI-YtcdZfCcQ5ePgjA9GHz0EqyWg0gZxzhJ3CeSbQQ3ZcCkAlYAfDC68av5rURiElgkcov58r30L9Bp6mQZ86SK8AGHMmccC-Z4w',
    description: "Tác phẩm kinh điển triết học phi lý của Albert Camus xoay quanh Meursault và cái nắng thiêu đốt của Alger.",
    sampleChapters: {
      title: 'Chương 1: Buổi Trưa Ở Alger',
      page1: [
        'Aujourd\'hui, maman est morte. Ou peut-être hier, je ne sais pas.',
        'Hôm nay mẹ mất. Hoặc có thể là ngày mai, tôi không rõ lắm.',
        'Cái nắng thiêu đốt của Alger như dội xuống đỉnh đầu những đợt sóng nhiệt hầm hập.'
      ],
      page2: [
        'Trong phòng tang lễ tĩnh mịch, mùi hoa ly nồng nặc khiến đầu óc Meursault có phần choáng váng.',
        'Anh uống một ly cà phê sữa và hút một điếu thuốc bên linh cữu.',
        'Mọi người nhìn anh với ánh mắt phán xét mà anh không mấy bận tâm.'
      ],
      page3: [
        'Sự thản nhiên trước cái chết và cuộc đời đưa Meursault đến định mệnh không thể đảo ngược.',
        'Một tác phẩm bất hủ về triết lý phi lý nhân sinh.'
      ]
    }
  },

  // LỊCH SỬ (History)
  {
    id: 'ls-1',
    title: 'Đại Việt Sử Ký Toàn Thư',
    author: 'Ngô Sĩ Liên',
    category: 'LỊCH SỬ',
    priceEUR: 32.00,
    priceVND: 320000,
    coverUrl: '',
    bgColor: '#5d4037',
    description: 'Bộ chính sử vô giá ghi chép từ thời Hồng Bàng đến triều đại Nhà Lê.',
    sampleChapters: {
      title: 'Kỷ Hồng Bàng Thị',
      page1: [
        'Họ Hồng Bàng từ thuở sơ khai gieo mầm văn minh trên dải đất phương Nam.',
        'Lạc Long Quân và Âu Cơ sinh ra trăm người con, mở mang bờ cõi nghìn năm.',
        'Sử cũ chép rõ ngọn ngành thế thứ và chiến công đánh đuổi giặc ngoại xâm.'
      ],
      page2: [
        'Triều đại Nhà Lý chuyển đô về Thăng Long, mở ra thời kỳ hưng thịnh bậc nhất.',
        'Bài thơ thần bên sông Như Nguyệt vang vang hào khí Đông A.',
        'Tấm lòng trung trinh vì nước vì dân của các bậc tiền nhân.'
      ],
      page3: [
        'Bản thiên hùng ca dựng nước và giữ nước trường tồn cùng dân tộc.'
      ]
    }
  },
  {
    id: 'ls-2',
    title: 'Sử Ký Tư Mã Thiên',
    author: 'Tư Mã Thiên',
    category: 'LỊCH SỬ',
    priceEUR: 29.00,
    priceVND: 290000,
    coverUrl: '',
    bgColor: '#442a22',
    description: 'Tuyệt tác lịch sử văn học Trung Hoa ghi chép hơn ba nghìn năm biến động.',
    sampleChapters: {
      title: 'Bản Kỷ Ngũ Đế',
      page1: [
        'Tư Mã Thiên dành trọn đời mình hoàn thành bộ sử ký vĩ đại bất chấp hình phạt tàn khốc.',
        'Từng dòng chữ khắc trên thẻ trúc là đúc kết xương máu của muôn đời.',
        'Từ thời Hoàng Đế đến Hán Vũ Đế, những thăng trầm của các triều đại.'
      ],
      page2: [
        'Hạng Vũ Bổn Kỷ ghi lại hình ảnh vị anh hùng thất thế bên sông Ô Giang.',
        'Khí phách hiên ngang cùng khúc hát cay đắng xé lòng.',
        'Lịch sử là tấm gương soi cho hậu thế suy ngẫm.'
      ],
      page3: [
        'Một tác phẩm kết hợp đỉnh cao giữa ghi chép lịch sử và nghệ thuật văn học.'
      ]
    }
  },

  // KHOA HỌC (Science)
  {
    id: 'kh-1',
    title: 'Vũ Trụ Của Carl Sagan',
    author: 'Carl Sagan',
    category: 'KHOA HỌC',
    priceEUR: 28.00,
    priceVND: 280000,
    coverUrl: '',
    bgColor: '#2c160e',
    description: 'Hành trình kỳ diệu khám phá vũ trụ bao la, hành tinh Trái Đất và nguồn gốc sự sống.',
    sampleChapters: {
      title: 'Chương 1: Bờ Biển Vũ Trụ',
      page1: [
        'Vũ trụ là tất cả những gì đang có, đã từng có, hoặc sẽ có bao giờ.',
        'Chỉ một cái liếc nhìn vào Vũ trụ cũng khiến ta rùng mình xúc động.',
        'Chúng ta là cách thức để Vũ trụ tự tìm hiểu về chính mình.'
      ],
      page2: [
        'Hàng trăm tỷ thiên hà trải dài trong không gian vô tận.',
        'Trái Đất chỉ là một chấm xanh mờ nhỏ bé lơ lửng trong tia nắng.',
        'Hãy trân trọng và bảo vệ ngôi nhà chung duy nhất của chúng ta.'
      ],
      page3: [
        'Khoa học không chỉ là tri thức, mà còn là thái độ hoài nghi và tò mò tích cực.'
      ]
    }
  },

  // NGHỆ THUẬT (Art)
  {
    id: 'nt-1',
    title: 'Câu Chuyện Nghệ Thuật',
    author: 'E.H. Gombrich',
    category: 'NGHỆ THUẬT',
    priceEUR: 35.00,
    priceVND: 350000,
    coverUrl: '',
    bgColor: '#75584d',
    description: 'Cuốn sách nhập môn nghệ thuật nổi tiếng nhất thế giới từ thời tiền sử đến hiện đại.',
    sampleChapters: {
      title: 'Chương 1: Kỳ Tích Của Sự Sáng Tạo',
      page1: [
        'Thực ra không có thứ gọi là Nghệ thuật. Chỉ có những nghệ sĩ.',
        'Từ những bức vẽ trong hang động Lascaux đến các kim tự tháp Ai Cập cổ đại.',
        'Nghệ thuật phản ánh khao khát vĩnh hằng của con người.'
      ],
      page2: [
        'Thời Kỳ Phục Hưng chứng kiến sự bùng nổ của thiên tài Leonardo da Vinci và Michelangelo.',
        'Ánh sáng, hình khối và tỷ lệ vàng đạt tới đỉnh cao hoàn mỹ.',
        'Cái đẹp không nằm ở sự bắt chước, mà nằm ở tâm hồn sáng tạo.'
      ],
      page3: [
        'Nghệ thuật hiện đại mở ra những chân trời tư duy hoàn toàn mới.'
      ]
    }
  }
];

// Curated pool of 10+ extra books per category for "Xem thêm" expand functionality
const EXTRA_BOOKS_DATABASE: Record<string, Omit<Book, 'id'>[]> = {
  'TRINH THÁM': [
    {
      title: 'Án Mạng Trên Chuyến Tàu Tốc Hành Orient',
      author: 'Agatha Christie',
      category: 'TRINH THÁM',
      priceEUR: 23.00,
      priceVND: 230000,
      coverUrl: '',
      bgColor: '#1e293b',
      description: 'Vụ án ly kỳ trên chuyến tàu Orient cô lập giữa tuyết trắng khi nạn nhân bị đâm 12 nhát.',
      sampleChapters: {
        title: 'Chương 1: Chuyến Tàu Trong Tuyết',
        page1: ['Tuyết rơi dày đặc làm chuyến tàu Orient dừng lại giữa cánh đồng hoang vắng.', 'Thám tử Hercule Poirot nhận thấy điều bất thường ngay từ cái nhìn đầu tiên.'],
        page2: ['Tiếng gõ cửa lúc 2 giờ sáng và vết máu mờ trên thảm lót sàn.', 'Mỗi hành khách trên toa tàu đều mang một bí mật chưa hé lộ.'],
        page3: ['Sự thật phũ phàng đứng sau danh tính thực sự của nạn nhân.']
      }
    },
    {
      title: 'Kẻ Giấu Mặt Trong Đêm',
      author: 'Higashino Keigo',
      category: 'TRINH THÁM',
      priceEUR: 24.50,
      priceVND: 245000,
      coverUrl: '',
      bgColor: '#0f172a',
      description: 'Tiểu thuyết trinh thám tâm lý đỉnh cao về màn đấu trí giữa giáo sư toán học và cảnh sát.',
      sampleChapters: {
        title: 'Chương 1: Thuật Toán Tội Lỗi',
        page1: ['Án mạng xảy ra trong căn hộ nhỏ ven sông vào một đêm mưa bão.', 'Chứng cứ ngoại phạm của hung thủ được tính toán hoàn hảo như một bài toán cao cấp.'],
        page2: ['Giáo sư Yukawa tìm thấy manh mối bất ngờ từ thói quen sinh hoạt của nạn nhân.'],
        page3: ['Khi logic gặp gỡ tình cảm, ranh giới đúng sai trở nên mong manh.']
      }
    },
    {
      title: 'Mật Mã Da Vinci',
      author: 'Dan Brown',
      category: 'TRINH THÁM',
      priceEUR: 26.00,
      priceVND: 260000,
      coverUrl: '',
      bgColor: '#331800',
      description: 'Hành trình giải mã những ký hiệu ẩn giấu trong các bức họa kinh điển tại bảo tàng Louvre.',
      sampleChapters: {
        title: 'Chương 1: Bảo Tàng Louvre Nửa Đêm',
        page1: ['Gió lạnh rít qua dãy hành lang vắng ngắt của bảo tàng nghệ thuật Louvre.', 'Giám đốc bảo tàng bị sát hại trong tư thế kỳ lạ gieo rắc ngỡ ngàng.'],
        page2: ['Chuyên gia ký hiệu học Robert Langdon phát hiện chuỗi số Fibonacci viết bằng máu.'],
        page3: ['Cuộc đi tìm Chén Thánh bùng nổ qua nhiều thế kỷ tri thức.']
      }
    },
    {
      title: 'Sự Im Lặng Của Bầy Cừu',
      author: 'Thomas Harris',
      category: 'TRINH THÁM',
      priceEUR: 25.00,
      priceVND: 250000,
      coverUrl: '',
      bgColor: '#2d0606',
      description: 'Cuộc gặp gỡ ám ảnh giữa nữ học viên FBI Clarice Starling và bác sĩ tâm thần Hannibal Lecter.',
      sampleChapters: {
        title: 'Chương 1: Tầng Hầm Bệnh Viện',
        page1: ['Tiếng bước chân vang vọng qua từng chái phòng giam kiên cố.', 'Lecter đứng đó với ánh mắt sắc lẹm thấu thị suy nghĩ người đối diện.'],
        page2: ['Những manh mối đắt giá đổi bằng việc giải mã ký ức tuổi thơ.'],
        page3: ['Tiếng kêu của bầy cừu trong đêm vẫn ám ảnh Clarice mỗi khi giật mình tỉnh giấc.']
      }
    },
    {
      title: 'Ánh Mắt Kẻ Sát Nhân',
      author: 'Jo Nesbø',
      category: 'TRINH THÁM',
      priceEUR: 22.00,
      priceVND: 220000,
      coverUrl: '',
      bgColor: '#172554',
      description: 'Thám tử Harry Hole đối mặt với tên sát nhân hàng loạt giấu mặt giữa tuyết giá Oslo.',
      sampleChapters: {
        title: 'Chương 1: Tuyết Đầu Mùa Ở Oslo',
        page1: ['Người hình tuyết xuất hiện trước khoảng sân của nạn nhân trước khi vụ mất tích xảy ra.'],
        page2: ['Mỗi vụ án đều để lại một dấu ấn băng giá không thể xói mòn.'],
        page3: ['Harry Hole lần theo dấu vết trong bóng tối lạnh lẽo của miền Bắc Âu.']
      }
    },
    {
      title: 'Tội Lỗi Không Tên',
      author: 'Guillaume Musso',
      category: 'TRINH THÁM',
      priceEUR: 21.50,
      priceVND: 215000,
      coverUrl: '',
      bgColor: '#312e81',
      description: 'Một bí mật thời trung học trở lại đe dọa cuộc sống bình yên của nhóm bạn thân.',
      sampleChapters: {
        title: 'Chương 1: Đêm Dạ Hội Mùa Hè',
        page1: ['Chiếc rương bị chôn giấu 25 năm trước dưới sàn nhà thể thao bất ngờ được đào lên.'],
        page2: ['Những tin nhắn đe dọa không người gửi xuất hiện trên điện thoại từng người.'],
        page3: ['Ai là kẻ năm xưa đã chứng kiến toàn bộ sự việc?']
      }
    },
    {
      title: 'Ảo Ảnh Phố Cổ',
      author: 'Nguyễn Nhật Ánh',
      category: 'TRINH THÁM',
      priceEUR: 19.00,
      priceVND: 190000,
      coverUrl: '',
      bgColor: '#1e1b4b',
      description: 'Vụ án bí ẩn xoay quanh tiệm sách cũ ngập tràn những món đồ cổ và câu chuyện quá khứ.',
      sampleChapters: {
        title: 'Chương 1: Căn Nhà Gỗ Cũ',
        page1: ['Mùi giấy cũ ngai ngái quyện vào tiếng mưa rơi trên mái ngói phố cổ.'],
        page2: ['Cuốn nhật ký bìa da ghi lại những sự kiện từ nửa thế kỷ trước.'],
        page3: ['Bí mật gia tộc dần hé mở qua từng trang viết ố vàng.']
      }
    },
    {
      title: 'Bức Thư Bí Mật',
      author: 'Keigo Higashino',
      category: 'TRINH THÁM',
      priceEUR: 23.50,
      priceVND: 235000,
      coverUrl: '',
      bgColor: '#111827',
      description: 'Những lá thư gửi từ trong tù và tác động sâu sắc đến số phận hai anh em.',
      sampleChapters: {
        title: 'Chương 1: Nhát Đâm Trong Đêm',
        page1: ['Vì muốn có tiền cho em trai đi học, người anh đã phạm phải sai lầm lớn nhất đời.'],
        page2: ['Mỗi tháng một lá thư gửi về từ trại giam chứa đựng nỗi dằn vò không nguôi.'],
        page3: ['Sự tha thứ và cái giá của định kiến xã hội.']
      }
    },
    {
      title: 'Dấu Ấn Rồng Thiêng',
      author: 'Stieg Larsson',
      category: 'TRINH THÁM',
      priceEUR: 27.00,
      priceVND: 270000,
      coverUrl: '',
      bgColor: '#022c22',
      description: 'Nhà báo Mikael Blomkvist và cô gái xăm hình Lisbeth Salander điều tra vụ mất tích.',
      sampleChapters: {
        title: 'Chương 1: Đảo Hẻo Lánh',
        page1: ['Cánh hoa khô gửi tặng sinh nhật mỗi năm gợi nhớ đến cô gái mất tích 40 năm trước.'],
        page2: ['Lisbeth thâm nhập vào mạng lưới dữ liệu mật với tài năng máy tính thiên bẩm.'],
        page3: ['Sự thật đen tối đằng sau đế chế tài chính gia tộc.']
      }
    },
    {
      title: 'Mặt Nạ Quỷ',
      author: 'Minato Kanae',
      category: 'TRINH THÁM',
      priceEUR: 22.00,
      priceVND: 220000,
      coverUrl: '',
      bgColor: '#450a0a',
      description: 'Những lời thú tội gai người xoay quanh cái chết của một nữ sinh trung học.',
      sampleChapters: {
        title: 'Chương 1: Buổi Học Cuối Cùng',
        page1: ['Cô giáo đứng trước lớp học lặng thinh thông báo quyết định nghỉ việc.'],
        page2: ['Cốc sữa chứa mầm bệnh và kế hoạch trả thù tàn nhẫn.'],
        page3: ['Vòng xoáy tội lỗi không có lối thoát của tuổi vị thành niên.']
      }
    }
  ],

  'VĂN HỌC': [
    {
      title: 'Trăm Năm Cô Đơn',
      author: 'Gabriel García Márquez',
      category: 'VĂN HỌC',
      priceEUR: 28.00,
      priceVND: 280000,
      coverUrl: '',
      bgColor: '#854d0e',
      description: 'Tuyệt tác chủ nghĩa thực tại huyền ảo xoay quanh 7 thế hệ dòng họ Buendía tại Macondo.',
      sampleChapters: {
        title: 'Chương 1: Làng Macondo Thuở Ban Đầu',
        page1: ['Nhiều năm sau này, trước họng súng của trung đội hành quyết, Đại tá Aureliano Buendía sẽ nhớ lại buổi chiều xa xôi ấy.'],
        page2: ['Macondo lúc đó là một làng gồm hai mươi túp lều bằng đất nặn bên bờ sông nước trong vắt.'],
        page3: ['Những phát minh của người du mục Bohemian mang lại điều kỳ diệu cho dân làng.']
      }
    },
    {
      title: 'Rừng Na Uy',
      author: 'Haruki Murakami',
      category: 'VĂN HỌC',
      priceEUR: 24.00,
      priceVND: 240000,
      coverUrl: '',
      bgColor: '#166534',
      description: 'Tiểu thuyết lãng mạn hoài niệm về tình yêu, sự mất mát và trưởng thành ở Tokyo thập niên 60.',
      sampleChapters: {
        title: 'Chương 1: Giai Điệu Norwegian Wood',
        page1: ['Tôi đã ba mươi tuổi, đang ngồi trên chiếc boeing hạ cánh xuống sân bay Hamburg.'],
        page2: ['Bản nhạc Rừng Na Uy cất lên kéo tôi trở về những cánh đồng cỏ xanh mùa thu năm ấy.'],
        page3: ['Ký ức về Naoko và câu chuyện ở khu điều dưỡng yên tĩnh.']
      }
    },
    {
      title: 'Hoàng Tử Bé',
      author: 'Antoine de Saint-Exupéry',
      category: 'VĂN HỌC',
      priceEUR: 16.00,
      priceVND: 160000,
      coverUrl: '',
      bgColor: '#0284c7',
      description: 'Cuốn sách triết lý giản dị sâu sắc về tình bạn, tình yêu và cách nhìn thế giới bằng trái tim.',
      sampleChapters: {
        title: 'Chương 1: Bức Vẽ Trăn Nuốt Voi',
        page1: ['Xin lỗi các bạn nhỏ vì tôi đã dành tặng cuốn sách này cho một người lớn.'],
        page2: ['Bức vẽ số 1 của tôi không phải là một chiếc mũ, mà là con trăn đang tiêu hóa con voi.'],
        page3: ['Hoàng tử bé từ hành tinh B-612 nhỏ bé bắt đầu hành trình ghé thăm các tiểu hành tinh.']
      }
    },
    {
      title: 'Ông Già Và Biển Cả',
      author: 'Ernest Hemingway',
      category: 'VĂN HỌC',
      priceEUR: 18.50,
      priceVND: 185000,
      coverUrl: '',
      bgColor: '#0369a1',
      description: 'Trận chiến kiên cường giữa lão ngư Santiago và con cá kiếm khổng lồ trên dòng Gulf Stream.',
      sampleChapters: {
        title: 'Chương 1: Tám Mươi Bốn Ngày Trắng Tay',
        page1: ['Lão già đánh cá một mình trên chiếc thuyền buồm nhỏ và đã tám mươi bốn ngày trôi qua lão không bắt được con cá nào.'],
        page2: ['Cậu bé Manolin vẫn luôn tin tưởng và chăm sóc lão già bằng tình thương chân thành.'],
        page3: ['"Con người có thể bị hủy diệt nhưng không thể bị đánh bại."']
      }
    },
    {
      title: 'Nhà Giả Kim',
      author: 'Paulo Coelho',
      category: 'VĂN HỌC',
      priceEUR: 19.00,
      priceVND: 190000,
      coverUrl: '',
      bgColor: '#b45309',
      description: 'Hành trình theo đuổi Vận Mệnh Của Bản Thân của chàng chăn cừu Santiago đến Kim Tự Tháp.',
      sampleChapters: {
        title: 'Chương 1: Chàng Chăn Cừu Và Những Giấc Mơ',
        page1: ['Santiago dẫn đàn cừu vào một nhà thờ cổ hoang phế khi hoàng hôn buông xuống Andalusia.'],
        page2: ['Giấc mơ lặp lại về kho báu bí ẩn dưới chân Kim Tự Tháp Ai Cập.'],
        page3: ['Lời dạy của vua Melchizedek: "Khi anh quyết chí muốn điều gì, cả vũ trụ sẽ hợp sức giúp anh."'
        ]
      }
    },
    {
      title: 'Kiêu Hãnh Và Định Kiến',
      author: 'Jane Austen',
      category: 'VĂN HỌC',
      priceEUR: 22.00,
      priceVND: 220000,
      coverUrl: '',
      bgColor: '#be185d',
      description: 'Tác phẩm cổ điển lãng mạn tinh tế về cô gái thông minh Elizabeth Bennet và ngài Darcy.',
      sampleChapters: {
        title: 'Chương 1: Sự Thật Đã Được Thừa Nhận',
        page1: ['Có một sự thật mà ai ai cũng công nhận, đó là một người đàn ông độc thân có tài sản hẳn phải cần một người vợ.'],
        page2: ['Bữa tiệc vũ hội tại Netherfield làm xáo động cuộc sống tĩnh lặng vùng quê.'],
        page3: ['Ấn tượng ban đầu kiêu hãnh và những hiểu lầm dần được xóa bỏ.']
      }
    },
    {
      title: 'Chiếc Lược Ngà',
      author: 'Nguyễn Quang Sáng',
      category: 'VĂN HỌC',
      priceEUR: 17.00,
      priceVND: 170000,
      coverUrl: '',
      bgColor: '#15803d',
      description: 'Tình cha con sâu nặng, xúc động lòng người trong những năm tháng chiến tranh gian khổ.',
      sampleChapters: {
        title: 'Chương 1: Ngày Trở Về Làng',
        page1: ['Anh Sáu về thăm nhà sau tám năm biền biệt tham gia kháng chiến.'],
        page2: ['Bé Thu không nhận cha vì vết sẹo dài trên gò má anh khác tấm ảnh cưới.'],
        page3: ['Tiếng gọi "Ba!" xé lòng cất lên vào phút giây chia ly trên bến sông.']
      }
    },
    {
      title: 'Số Đỏ',
      author: 'Vũ Trọng Phụng',
      category: 'VĂN HỌC',
      priceEUR: 20.00,
      priceVND: 200000,
      coverUrl: '',
      bgColor: '#c2410c',
      description: 'Kiệt tác trào phúng đỉnh cao khắc họa xã hội thành thị Việt Nam thời kỳ Âu hóa.',
      sampleChapters: {
        title: 'Chương 1: Xuất Thân Của Xuân Tóc Đỏ',
        page1: ['Xuân Tóc Đỏ từ một kẻ nhặt bóng ở sân quần vợt bất ngờ bước chân vào giới thượng lưu.'],
        page2: ['Phong trào Âu hóa và những màn bi hài kịch giả tạo của gia đình cụ Cố Hồng.'],
        page3: ['Đỉnh cao của sự lố lăng và danh xưng "anh hùng cứu quốc".']
      }
    },
    {
      title: 'Tắt Đèn',
      author: 'Ngô Tất Tố',
      category: 'VĂN HỌC',
      priceEUR: 18.00,
      priceVND: 180000,
      coverUrl: '',
      bgColor: '#451a03',
      description: 'Bức tranh hiện thực khốc liệt về số phận người nông dân Việt Nam dưới gánh nặng thuế sưu.',
      sampleChapters: {
        title: 'Chương 1: Vụ Thuế Mùa Xuất',
        page1: ['Tiếng trống sưu dồn dập vang lên từ đình làng xé tan không khí u ám.'],
        page2: ['Chị Dậu chạy đôn chạy đáo vay mượn khắp nơi để cứu anh Dậu đang bị trói ở đình.'],
        page3: ['Hành động vùng lên mạnh mẽ trong đêm tối "tối đen như mực như cái số của chị".']
      }
    },
    {
      title: 'Những Người Khốn Khổ',
      author: 'Victor Hugo',
      category: 'VĂN HỌC',
      priceEUR: 32.00,
      priceVND: 320000,
      coverUrl: '',
      bgColor: '#3f6212',
      description: 'Epic văn học Pháp vĩ đại về lòng nhân ái, sự cứu rỗi và tình yêu thương con người.',
      sampleChapters: {
        title: 'Chương 1: Tấm Bánh Mỳ Và Chuỗi Khổ Sai',
        page1: ['Jean Valjean bị kết án 19 năm khổ sai chỉ vì ăn trộm một chiếc bánh mỳ nuôi cháu.'],
        page2: ['Giám mục Myriel tặng anh hai chân nến bằng bạc, thắp sáng linh hồn tăm tối.'],
        page3: ['Hành trình trở thành người lương thiện và sự hy sinh cao cả vì Fantine và Cosette.']
      }
    }
  ],

  'LỊCH SỬ': [
    {
      title: 'Sapiens: Lược Sử Loài Người',
      author: 'Yuval Noah Harari',
      category: 'LỊCH SỬ',
      priceEUR: 30.00,
      priceVND: 300000,
      coverUrl: '',
      bgColor: '#78350f',
      description: 'Hành trình tiến hóa của Homo Sapiens từ loài động vật vô danh thành bá chủ Trái Đất.',
      sampleChapters: {
        title: 'Chương 1: Cách Mạng Nhận Thức',
        page1: ['70.000 năm trước, Homo Sapiens bắt đầu phát triển khả năng ngôn ngữ kỳ diệu.'],
        page2: ['Khả năng tin vào những điều hư cấu chung (tôn giáo, tiền bạc, quốc gia) giúp hàng triệu người hợp tác.'],
        page3: ['Cách mạng nông nghiệp: Bẫy lớn nhất trong lịch sử nhân loại?']
      }
    },
    {
      title: 'Việt Nam Sử Lược',
      author: 'Trần Trọng Kim',
      category: 'LỊCH SỬ',
      priceEUR: 26.00,
      priceVND: 260000,
      coverUrl: '',
      bgColor: '#451a03',
      description: 'Bộ sử tổng hợp hiện đại đầu tiên bằng chữ Quốc ngữ hệ thống hóa toàn bộ lịch sử Việt Nam.',
      sampleChapters: {
        title: 'Chương 1: Thượng Cổ Thời Kỳ',
        page1: ['Nước Việt Nam ta ở vào phía đông nam lục địa châu Á.'],
        page2: ['Thế thứ các triều đại từ Hồng Bàng, Đinh, Lê, Lý, Trần đến Nhà Nguyễn.'],
        page3: ['Những trận đánh oanh liệt bảo vệ chủ quyền lãnh thổ nghìn năm.']
      }
    },
    {
      title: 'Súng, Mầm Bệnh Và Thép',
      author: 'Jared Diamond',
      category: 'LỊCH SỬ',
      priceEUR: 29.00,
      priceVND: 290000,
      coverUrl: '',
      bgColor: '#3f6212',
      description: 'Lý giải số phận khác nhau của các văn minh nhân loại qua yếu tố địa lý và môi trường.',
      sampleChapters: {
        title: 'Chương 1: Vùng Đất Khởi Đầu',
        page1: ['Tại sao người châu Âu lại chinh phục châu Mỹ mà không phải ngược lại?'],
        page2: ['Sự thuần hóa cây trồng, vật nuôi và phát triển mầm bệnh dịch.'],
        page3: ['Bản đồ địa lý quyết định sự phân phân phối quyền lực thế giới.']
      }
    },
    {
      title: 'Lịch Sử Thế Giới Qua 100 Vật Phẩm',
      author: 'Neil MacGregor',
      category: 'LỊCH SỬ',
      priceEUR: 31.00,
      priceVND: 310000,
      coverUrl: '',
      bgColor: '#1e293b',
      description: 'Khám phá 2 triệu năm văn minh nhân loại qua 100 cổ vật lưu giữ tại Bảo tàng Anh.',
      sampleChapters: {
        title: 'Chương 1: Công Cụ Cắt Bằng Đá Olduvai',
        page1: ['Hòn đá thô sơ hai triệu năm tuổi mở đầu cho hành trình sáng tạo của con người.'],
        page2: ['Từ phiến đá Rosetta đến chiếc tượng nhân sư Ai Cập.'],
        page3: ['Mỗi vật phẩm là một nhân chứng kể lại câu chuyện về thời đại của nó.']
      }
    },
    {
      title: 'Sử Bắc Hà',
      author: 'Lê Quý Đôn',
      category: 'LỊCH SỬ',
      priceEUR: 25.00,
      priceVND: 250000,
      coverUrl: '',
      bgColor: '#713f12',
      description: 'Ghi chép chi tiết của nhà bác học Lê Quý Đôn về tình hình Bắc Hà thế kỷ XVIII.',
      sampleChapters: {
        title: 'Chương 1: Phong Thổ Và Con Người',
        page1: ['Ghi chép tỉ mỉ về địa lý, tài nguyên và phong tục tập quán các trấn miền Bắc.'],
        page2: ['Biến động chính trị và các sự kiện lịch sử dưới thời Vua Lê - Chúa Trịnh.'],
        page3: ['Tài liệu lịch sử vô giá cho các thế hệ nghiên cứu sau này.']
      }
    },
    {
      title: 'Đông Dương Xưa',
      author: 'Paul Doumer',
      category: 'LỊCH SỬ',
      priceEUR: 27.50,
      priceVND: 275000,
      coverUrl: '',
      bgColor: '#1e1b4b',
      description: 'Hồi ký của Toàn quyền Đông Dương khắc họa bức tranh xã hội Việt Nam cuối thế kỷ XIX.',
      sampleChapters: {
        title: 'Chương 1: Ấn Tượng Đầu Tiên Về Hà Nội',
        page1: ['Hành trình trên sông Hồng và việc xây dựng cầu Long Biên lịch sử.'],
        page2: ['Ghi chép góc nhìn của một chính khách phương Tây về văn hóa bản địa.'],
        page3: ['Những chuyển biến cơ sở hạ tầng thời kỳ đầu bảo hộ.']
      }
    },
    {
      title: 'Triều Đại Nhà Trần',
      author: 'Nguyễn Lương Bích',
      category: 'LỊCH SỬ',
      priceEUR: 24.00,
      priceVND: 240000,
      coverUrl: '',
      bgColor: '#831843',
      description: 'Chuyên luận lịch sử đặc sắc về ba lần chiến thắng quân Nguyên Mông lẫy lừng.',
      sampleChapters: {
        title: 'Chương 1: Hào Khí Đông A',
        page1: ['Hội nghị Điện Diên Hồng vang vọng tiếng hô "Đánh!" của các bô lão.'],
        page2: ['Trận Bạch Đằng vĩ đại với chiến thuật cọc gỗ cắm ngầm dưới lòng sông.'],
        page3: ['Nghệ thuật quân sự độc đáo và tinh thần đoàn kết toàn dân.']
      }
    },
    {
      title: 'Chiến Quốc C策',
      author: 'Lưu Hướng',
      category: 'LỊCH SỬ',
      priceEUR: 23.00,
      priceVND: 230000,
      coverUrl: '',
      bgColor: '#1c1917',
      description: 'Tuyệt tác ghi chép mưu lược, ngoại giao của các thuyết khách thời Chiến Quốc.',
      sampleChapters: {
        title: 'Chương 1: Tề C策 - Phùng Huyên Đi Nợ',
        page1: ['Màn đấu trí căng thẳng giữa các nước Tần, Sở, Tề, Yên, Triệu, Ngụy, Hàn.'],
        page2: ['Nghệ thuật thuyết phục đỉnh cao bằng lý lẽ và sự am hiểu lòng người.'],
        page3: ['Những bài học mưu lược ngoại giao vẫn còn nguyên giá trị.']
      }
    },
    {
      title: 'Lịch Sử Văn Minh Văn Lang',
      author: 'Đào Duy Anh',
      category: 'LỊCH SỬ',
      priceEUR: 22.00,
      priceVND: 220000,
      coverUrl: '',
      bgColor: '#365314',
      description: 'Công trình khảo cứu lịch sử cổ đại Việt Nam và nền văn hóa Đông Sơn rực rỡ.',
      sampleChapters: {
        title: 'Chương 1: Trống Đồng Đông Sơn',
        page1: ['Những hoa văn tinh xảo trên mặt trống đồng kể lại đời sống sinh hoạt thời cổ đại.'],
        page2: ['Kỹ thuật đúc đồng đỉnh cao và dấu ấn nghề trồng lúa nước.'],
        page3: ['Khẳng định cội nguồn văn minh sông Hồng ngàn năm văn hiến.']
      }
    },
    {
      title: 'Lịch Sử Đế Quốc La Mã',
      author: 'Edward Gibbon',
      category: 'LỊCH SỬ',
      priceEUR: 34.00,
      priceVND: 340000,
      coverUrl: '',
      bgColor: '#7f1d1d',
      description: 'Sử thi đồ sộ về sự suy tàn và sụp đổ của một trong những đế chế vĩ đại nhất.',
      sampleChapters: {
        title: 'Chương 1: Thời Kỳ Hoàng Kim Của Các Hoàng Đế',
        page1: ['Sự hưng thịnh dưới thời năm vị hoàng đế hiền minh Antoninus.'],
        page2: ['Những nguyên nhân bên trong và áp lực rợ man phương Bắc gây nên sự sụp đổ.'],
        page3: ['Bài học lịch sử vĩnh cửu về sự hưng vong của các thế lực cầm quyền.']
      }
    }
  ],

  'KHOA HỌC': [
    {
      title: 'Lược Sử Thời Gian',
      author: 'Stephen Hawking',
      category: 'KHOA HỌC',
      priceEUR: 25.00,
      priceVND: 250000,
      coverUrl: '',
      bgColor: '#1e1b4b',
      description: 'Cuốn sách bán chạy nhất về vật lý lý thuyết, lỗ đen và lý thuyết dây đại chúng.',
      sampleChapters: {
        title: 'Chương 1: Bức Tranh Vũ Trụ Của Chúng Ta',
        page1: ['Một nhà khoa học nổi tiếng diễn thuyết về thiên văn học và hình dạng Trái Đất.'],
        page2: ['Lỗ đen, thuyết tương đối tổng quát của Einstein và cơ học lượng tử.'],
        page3: ['Đi tìm Lý Thuyết Thống Nhất Hoàn Hảo để hiểu được "tâm trí của Chúa".']
      }
    },
    {
      title: 'Gen: Lịch Sử Mật Mã Sự Sống',
      author: 'Siddhartha Mukherjee',
      category: 'KHOA HỌC',
      priceEUR: 28.50,
      priceVND: 285000,
      coverUrl: '',
      bgColor: '#047857',
      description: 'Hành trình khám phá đơn vị di truyền cơ bản nhất định hình số phận con người.',
      sampleChapters: {
        title: 'Chương 1: Khu Vườn Thí Nghiệm Của Mendel',
        page1: ['Gregor Mendel lặng lẽ trồng những cây đậu hà lan trong tu viện Brno.'],
        page2: ['Cấu trúc xoắn đôi DNA do Watson, Crick và Rosalind Franklin phát hiện.'],
        page3: ['Công nghệ chỉnh sửa gen CRISP-Cas9 và tương lai đạo đức sinh học.']
      }
    },
    {
      title: 'Tư Duy Nhanh Và Chậm',
      author: 'Daniel Kahneman',
      category: 'KHOA HỌC',
      priceEUR: 27.00,
      priceVND: 270000,
      coverUrl: '',
      bgColor: '#1d4ed8',
      description: 'Khám phá hai hệ thống tư duy quyết định mọi lựa chọn và sai lầm nhận thức.',
      sampleChapters: {
        title: 'Chương 1: Hệ Thống 1 Và Hệ Thống 2',
        page1: ['Hệ thống 1 hoạt động tự động, nhanh chóng, tốn ít sức lực.'],
        page2: ['Hệ thống 2 tập trung sự chú ý vào các hoạt động tư duy phức tạp.'],
        page3: ['Bẫy nhận thức và cách đưa ra quyết định sáng suốt hơn trong cuộc sống.']
      }
    },
    {
      title: 'Thực Tế Không Như Ta Tưởng',
      author: 'Carlo Rovelli',
      category: 'KHOA HỌC',
      priceEUR: 22.00,
      priceVND: 220000,
      coverUrl: '',
      bgColor: '#4c1d95',
      description: 'Hấp dẫn về bản chất của không gian, thời gian và hấp dẫn lượng tử vòng.',
      sampleChapters: {
        title: 'Chương 1: Hạt Bụi Không Gian',
        page1: ['Không gian không phải là một chiếc hộp rỗng, mà là một thực thể động linh hoạt.'],
        page2: ['Thời gian không trôi đều đặn mà chậm lại gần các vật thể khối lượng lớn.'],
        page3: ['Những hạt lượng tử nhỏ bé dệt nên cấu trúc của vũ trụ.']
      }
    },
    {
      title: 'Sức Mạnh Của Thói Quen',
      author: 'Charles Duhigg',
      category: 'KHOA HỌC',
      priceEUR: 21.00,
      priceVND: 210000,
      coverUrl: '',
      bgColor: '#b91c1c',
      description: 'Giải mã vòng lặp thói quen: Gợi ý - Hành động - Phần thưởng và cách thay đổi chúng.',
      sampleChapters: {
        title: 'Chương 1: Vòng Lặp Thói Quen',
        page1: ['Tại sao chúng ta lại làm những việc chúng ta làm trong cuộc sống hàng ngày?'],
        page2: ['Hạch nền trong bộ não ghi nhớ các chuỗi hành động thành thói quen tự động.'],
        page3: ['Phương pháp khoa học tái cấu trúc thói quen để làm chủ bản thân.']
      }
    },
    {
      title: 'Bản Thiết Kế Cuộc Sống',
      author: 'Richard Dawkins',
      category: 'KHOA HỌC',
      priceEUR: 26.00,
      priceVND: 260000,
      coverUrl: '',
      bgColor: '#0f766e',
      description: 'Góc nhìn đột phá về sinh học tiến hóa qua lý thuyết "Gen vị kỷ".',
      sampleChapters: {
        title: 'Chương 1: Những Cỗ Máy Tự Nhân Bản',
        page1: ['Sinh vật chỉ là cỗ máy sinh tồn được gen sử dụng để duy trì sự sống.'],
        page2: ['Khái niệm "Meme" - Đơn vị truyền tải văn hóa tương tự như gen.'],
        page3: ['Sự hợp tác altruism dưới góc độ bảo tồn nguồn gen di truyền.']
      }
    },
    {
      title: 'Vũ Trụ Trong Nhẫn Cỏ',
      author: 'Michio Kaku',
      category: 'KHOA HỌC',
      priceEUR: 24.00,
      priceVND: 240000,
      coverUrl: '',
      bgColor: '#312e81',
      description: 'Viễn cảnh tương lai về du hành không gian, siêu không gian và đa vũ trụ.',
      sampleChapters: {
        title: 'Chương 1: Vượt Qua Chiều Thứ Ba',
        page1: ['Hình dung về thế giới của những sinh vật sống trong mặt phẳng hai chiều.'],
        page2: ['Lỗ sâu vô tận và khả năng bẻ cong thời gian không gian.'],
        page3: ['Tương lai của văn minh loài người khi làm chủ năng lượng vũ trụ.']
      }
    },
    {
      title: 'Lịch Sử Tự Nhiên',
      author: 'Pliny the Elder',
      category: 'KHOA HỌC',
      priceEUR: 30.00,
      priceVND: 300000,
      coverUrl: '',
      bgColor: '#3f6212',
      description: 'Bách khoa toàn thư cổ đại ghi chép tri thức tự nhiên thời La Mã cổ đại.',
      sampleChapters: {
        title: 'Chương 1: Thiên Văn Và Trái Đất',
        page1: ['Quan niệm của người La Mã cổ đại về vị trí của Trái Đất và các vì sao.'],
        page2: ['Mô tả chi tiết về thực vật, động vật và khoáng vật thời cổ đại.'],
        page3: ['Tập hợp tri thức đồ sộ đặt nền móng cho khoa học tự nhiên.']
      }
    },
    {
      title: 'Trí Tuệ Nhân Tạo 2026',
      author: 'Max Tegmark',
      category: 'KHOA HỌC',
      priceEUR: 26.50,
      priceVND: 265000,
      coverUrl: '',
      bgColor: '#0369a1',
      description: 'Cuộc cách mạng AI, trí tuệ siêu việt (AGI) và tác động đến tương lai loài người.',
      sampleChapters: {
        title: 'Chương 1: Các Bậc Trí Tuệ',
        page1: ['Từ thuật toán máy học đơn giản đến mô hình ngôn ngữ lớn và trí tuệ nhân tạo tổng hợp.'],
        page2: ['Kiểm soát an toàn AI và định hướng giá trị đạo đức cho máy tính.'],
        page3: ['Kịch bản cuộc sống của nhân loại khi AI vượt qua trí tuệ con người.']
      }
    },
    {
      title: 'Mật Mã Sinh Học',
      author: 'Jennifer Doudna',
      category: 'KHOA HỌC',
      priceEUR: 25.00,
      priceVND: 250000,
      coverUrl: '',
      bgColor: '#0e7490',
      description: 'Câu chuyện phía sau giải Nobel Hóa học với công nghệ chỉnh sửa gen CRISPR.',
      sampleChapters: {
        title: 'Chương 1: Kéo Sinh Học',
        page1: ['Phát hiện cơ chế tự vệ của vi khuẩn trước sự tấn công của virus.'],
        page2: ['Biến đổi enzyme Cas9 thành công cụ cắt dán DNA chính xác tới từng nucleotide.'],
        page3: ['Chữa trị bệnh di truyền và những thách thức đạo đức kỷ nguyên sinh học mới.']
      }
    }
  ],

  'NGHỆ THUẬT': [
    {
      title: 'Cách Nhìn Nghệ Thuật',
      author: 'John Berger',
      category: 'NGHỆ THUẬT',
      priceEUR: 22.00,
      priceVND: 220000,
      coverUrl: '',
      bgColor: '#831843',
      description: 'Khai phóng tư duy thưởng thức thị giác và thông điệp ẩn sau các tác phẩm nghệ thuật.',
      sampleChapters: {
        title: 'Chương 1: Thị Giác Đi Trước Ngôn Từ',
        page1: ['Trẻ em nhìn và nhận biết thế giới trước khi có thể cất tiếng nói.'],
        page2: ['Máy ảnh đã thay đổi vĩnh viễn cách chúng ta chiêm ngưỡng một bức tranh.'],
        page3: ['Bối cảnh lịch sử và quyền lực tác động đến giá trị của tác phẩm.']
      }
    },
    {
      title: 'Nhật Ký Của Leonardo da Vinci',
      author: 'Walter Isaacson',
      category: 'NGHỆ THUẬT',
      priceEUR: 29.00,
      priceVND: 290000,
      coverUrl: '',
      bgColor: '#713f12',
      description: 'Tiểu sử hấp dẫn về thiên tài toàn năng bậc nhất lịch sử Phục Hưng.',
      sampleChapters: {
        title: 'Chương 1: Đứa Trẻ Làng Vinci',
        page1: ['Nhiệt huyết tò mò không giới hạn về giải phẫu, hội họa và kỹ thuật.'],
        page2: ['Quá trình sáng tạo nụ cười bí ẩn của Mona Lisa và The Last Supper.'],
        page3: ['Sự kết hợp hoàn hảo giữa khoa học và nghệ thuật trong từng nét vẽ.']
      }
    },
    {
      title: 'Bức Tranh Mona Lisa Bí Ẩn',
      author: 'Donald Sassoon',
      category: 'NGHỆ THUẬT',
      priceEUR: 24.00,
      priceVND: 240000,
      coverUrl: '',
      bgColor: '#3f6212',
      description: 'Hành trình bức chân dung trở thành biểu tượng văn hóa nổi tiếng nhất toàn cầu.',
      sampleChapters: {
        title: 'Chương 1: Vụ Trộm Năm 1911',
        page1: ['Bức tranh Mona Lisa biến mất khỏi Louvre chỉ sau một đêm làm xôn xao dư luận.'],
        page2: ['Kỹ thuật Sfumato mờ ảo che phủ đường nét khóe miệng.'],
        page3: ['Sức hút vượt thời gian chinh phục trái tim hàng triệu du khách.']
      }
    },
    {
      title: 'Lịch Sử Kiến Trúc Thế Giới',
      author: 'Banister Fletcher',
      category: 'NGHỆ THUẬT',
      priceEUR: 35.00,
      priceVND: 350000,
      coverUrl: '',
      bgColor: '#1e293b',
      description: 'Bách khoa toàn thư so sánh các phong cách kiến trúc từ Hy Lạp cổ đại đến chọc trời.',
      sampleChapters: {
        title: 'Chương 1: Cột Đền Hy Lạp',
        page1: ['Ba thức cột Doric, Ionic và Corinthian định hình thẩm mỹ phương Tây.'],
        page2: ['Mái vòm Gothic vươn cao lên bầu trời thể hiện niềm tin tôn giáo.'],
        page3: ['Kiến trúc hiện đại: "Hình thức đi theo công năng" (Form follows function).']
      }
    },
    {
      title: 'Nghệ Thuật Nhiếp Ảnh Mới',
      author: 'Henri Cartier-Bresson',
      category: 'NGHỆ THUẬT',
      priceEUR: 26.00,
      priceVND: 260000,
      coverUrl: '',
      bgColor: '#18181b',
      description: 'Triết lý "Khoảnh Khắc Quyết Định" của bậc thầy nhiếp ảnh đường phố thế giới.',
      sampleChapters: {
        title: 'Chương 1: Khoảnh Khắc Quyết Định',
        page1: ['Bắt trọn nhịp đập của cuộc sống chỉ trong 1/125 giây bấm máy.'],
        page2: ['Bố cục hình học tự nhiên hiện lên trên từng khung ảnh đen trắng.'],
        page3: ['Ống kính máy ảnh là sự mở rộng của con mắt và trái tim người nghệ sĩ.']
      }
    },
    {
      title: 'Âm Nhạc Và Tâm Hồn',
      author: 'Oliver Sacks',
      category: 'NGHỆ THUẬT',
      priceEUR: 23.00,
      priceVND: 230000,
      coverUrl: '',
      bgColor: '#4c1d95',
      description: 'Nghiên cứu thần kinh học về tác động kỳ diệu của giai điệu âm nhạc tới não bộ.',
      sampleChapters: {
        title: 'Chương 1: Ám Ảnh Giai Điệu',
        page1: ['Tại sao một đoạn nhạc có thể đọng lại trong đầu chúng ta suốt nhiều ngày?'],
        page2: ['Âm nhạc giúp phục hồi trí nhớ và vận động cho những bệnh nhân thần kinh.'],
        page3: ['Sức mạnh kết nối cảm xúc kỳ diệu của ngôn ngữ không lời.']
      }
    },
    {
      title: 'Sắc Màu Phục Hưng',
      author: 'Giorgio Vasari',
      category: 'NGHỆ THUẬT',
      priceEUR: 28.00,
      priceVND: 280000,
      coverUrl: '',
      bgColor: '#854d0e',
      description: 'Tập tiểu sử nghệ sĩ cổ điển đầu tiên tôn vinh các bậc thầy thời Phục Hưng Ý.',
      sampleChapters: {
        title: 'Chương 1: Giotto Và Sự Hồi Sinh Của Hội Họa',
        page1: ['Giotto phá vỡ phong cách Byzantine cứng nhắc để thổi sức sống vào nhân vật.'],
        page2: ['Michelangelo tạc tượng David từ khối đá cẩm thạch bị bỏ hoang.'],
        page3: ['Kỷ nguyên vàng của sự trỗi dậy tinh thần nhân văn.']
      }
    },
    {
      title: 'Thiết Kế Của Sự Vật Hàng Ngày',
      author: 'Don Norman',
      category: 'NGHỆ THUẬT',
      priceEUR: 21.50,
      priceVND: 215000,
      coverUrl: '',
      bgColor: '#0284c7',
      description: 'Kinh điển về tư duy thiết kế trải nghiệm người dùng (UX) và tính hữu dụng.',
      sampleChapters: {
        title: 'Chương 1: Sự Bất Lực Của Đồ Vật',
        page1: ['Tại sao bạn lại đẩy một cánh cửa vốn được thiết kế để kéo?'],
        page2: ['Khái niệm "Affordance" - Khả năng gợi ý hành động tự nhiên của vật thể.'],
        page3: ['Thiết kế nhân văn lấy con người làm trung tâm (Human-centered design).']
      }
    },
    {
      title: 'Hội Họa Ấn Tượng',
      author: 'Claude Monet',
      category: 'NGHỆ THUẬT',
      priceEUR: 27.00,
      priceVND: 270000,
      coverUrl: '',
      bgColor: '#047857',
      description: 'Cuộc cách mạng màu sắc và ánh sáng của nhóm họa sĩ Impressionism thế kỷ XIX.',
      sampleChapters: {
        title: 'Chương 1: Ấn Tượng Mặt Trời Mọc',
        page1: ['Rời bỏ xưởng vẽ gò bó để hòa mình vào thiên nhiên vẽ ngoài trời (en plein air).'],
        page2: ['Những vệt màu nguyên bản bắt trọn sự biến đổi ánh sáng từng khoảnh khắc.'],
        page3: ['Ao hoa súng Giverny và những tác phẩm đỉnh cao cuối đời của Monet.']
      }
    },
    {
      title: 'Gốm Sứ Vô Giá',
      author: 'Trần Anh Dũng',
      category: 'NGHỆ THUẬT',
      priceEUR: 25.00,
      priceVND: 250000,
      coverUrl: '',
      bgColor: '#78350f',
      description: 'Khảo cứu nghệ thuật gốm sứ Việt Nam qua các thời kỳ Đinh, Lê, Lý, Trần, Lê Sơ.',
      sampleChapters: {
        title: 'Chương 1: Men Ngọc Thời Lý',
        page1: ['Lớp men ngọc trong vắt tựa cẩm thạch trên các ấm rượu hình hoa sen.'],
        page2: ['Gốm hoa nâu thời Trần mang đậm khí phách mạnh mẽ phóng khoáng.'],
        page3: ['Gốm Chu Đậu nổi danh trên các con tàu cổ đắm dưới lòng biển sâu.']
      }
    }
  ]
};

const BRAND_AFFILIATIONS = [
  { brandId: 'nha-nam', brandName: 'Nhã Nam Official', publisher: 'NXB Hội Nhà Văn / Nhã Nam' },
  { brandId: 'fahasa', brandName: 'Nhà Sách Fahasa', publisher: 'Fahasa Phân Phối Chính Hãng' },
  { brandId: 'nxb-tre', brandName: 'Nhà Xuất Bản Trẻ', publisher: 'NXB Trẻ' },
  { brandId: 'kim-dong', brandName: 'Nhà Xuất Bản Kim Đồng', publisher: 'NXB Kim Đồng' },
  { brandId: 'phuong-nam', brandName: 'Nhà Sách Phương Nam', publisher: 'Phương Nam Book' },
  { brandId: 'dong-a', brandName: 'Đông A Books', publisher: 'NXB Văn Học / Đông A' },
  { brandId: 'alpha-books', brandName: 'Alpha Books & Omega+', publisher: 'Alpha Books / Omega+' }
];

export function enrichBookWithB2C(book: Book, indexSeed: number = 0): Book {
  let hash = 0;
  const str = book.id + book.title;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const absSeed = Math.abs(hash) + indexSeed;

  let brandInfo = BRAND_AFFILIATIONS[absSeed % BRAND_AFFILIATIONS.length];
  if (book.category === 'TRINH THÁM') {
    const list = [BRAND_AFFILIATIONS[0], BRAND_AFFILIATIONS[1], BRAND_AFFILIATIONS[2], BRAND_AFFILIATIONS[5]];
    brandInfo = list[absSeed % list.length];
  } else if (book.category === 'VĂN HỌC') {
    const list = [BRAND_AFFILIATIONS[0], BRAND_AFFILIATIONS[2], BRAND_AFFILIATIONS[4], BRAND_AFFILIATIONS[5], BRAND_AFFILIATIONS[3]];
    brandInfo = list[absSeed % list.length];
  } else if (book.category === 'LỊCH SỬ') {
    const list = [BRAND_AFFILIATIONS[6], BRAND_AFFILIATIONS[5], BRAND_AFFILIATIONS[2], BRAND_AFFILIATIONS[1]];
    brandInfo = list[absSeed % list.length];
  } else if (book.category === 'KHOA HỌC') {
    const list = [BRAND_AFFILIATIONS[6], BRAND_AFFILIATIONS[1], BRAND_AFFILIATIONS[3], BRAND_AFFILIATIONS[2]];
    brandInfo = list[absSeed % list.length];
  } else if (book.category === 'NGHỆ THUẬT') {
    const list = [BRAND_AFFILIATIONS[5], BRAND_AFFILIATIONS[4], BRAND_AFFILIATIONS[0], BRAND_AFFILIATIONS[6]];
    brandInfo = list[absSeed % list.length];
  }

  const discountRate = 0.12 + (absSeed % 18) / 100; // 12% to 29%
  const originalPriceVND = book.originalPriceVND || Math.round((book.priceVND * (1 + discountRate)) / 5000) * 5000;
  const discountPercent = book.discountPercent || Math.round(((originalPriceVND - book.priceVND) / originalPriceVND) * 100);

  const editionTypes = ['Bìa Mềm Tiêu Chuẩn', 'Bìa Cứng Áo Bọc', 'Ấn Bản Đặc Biệt', 'Bìa Mềm Tay Gập'];
  const editionType = book.editionType || editionTypes[absSeed % editionTypes.length];

  return {
    ...book,
    brandId: book.brandId || brandInfo.brandId,
    brandName: book.brandName || brandInfo.brandName,
    publisher: book.publisher || brandInfo.publisher,
    originalPriceVND,
    discountPercent,
    editionType,
    isbn: book.isbn || `978-604-${100 + (absSeed % 800)}-${1000 + (absSeed % 8999)}-${absSeed % 9}`,
    pageCount: book.pageCount || 180 + (absSeed % 380),
    publishYear: book.publishYear || 2022 + (absSeed % 4),
    stock: book.stock || 15 + (absSeed % 65)
  };
}

export const BOOKS_DATA: Book[] = RAW_BOOKS_DATA.map((b, idx) => enrichBookWithB2C(b, idx));

// Helper function to generate 10 additional unique books for any category
export function generateExtraBooks(
  category: string,
  existingCount: number,
  requestedCount: number = 10
): Book[] {
  const pool = EXTRA_BOOKS_DATABASE[category] || EXTRA_BOOKS_DATABASE['VĂN HỌC'];
  const generated: Book[] = [];

  for (let i = 0; i < requestedCount; i++) {
    const itemIndex = (existingCount + i) % pool.length;
    const base = pool[itemIndex];
    const cycle = Math.floor((existingCount + i) / pool.length) + 1;

    const id = `${category.toLowerCase().replace(/\s+/g, '')}-extra-${existingCount + i + 1}`;
    const suffix = cycle > 1 ? ` (Tập ${cycle})` : '';

    const rawItem: Book = {
      ...base,
      id,
      title: `${base.title}${suffix}`,
      priceEUR: +(base.priceEUR + (cycle - 1) * 2).toFixed(2),
      priceVND: base.priceVND + (cycle - 1) * 20000,
      sampleChapters: {
        ...base.sampleChapters,
        title: `${base.sampleChapters.title}${suffix}`
      }
    };

    generated.push(enrichBookWithB2C(rawItem, existingCount + i));
  }

  return generated;
}

