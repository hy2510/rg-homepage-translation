function getLanguage(pText) {
    var usermsg = "";
    switch (pText) {
        case "고객센터에 문의해 주세요.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Please contact the customer center.";
            else if (gvLanguage == "CHN") usermsg = "请联系客户中心.";
            else if (gvLanguage == "JPN") usermsg = "カスタマーセンターにお問い合わせください.";
            else if (gvLanguage == "VTN") usermsg = "Vui lòng liên hệ với trung tâm khách hàng.";
            else if (gvLanguage == "INE") usermsg = "Silakan hubungi pusat pelanggan.";
            break;

        case "더 크게 말해주세요!":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Speak Louder!";
            else if (gvLanguage == "CHN") usermsg = "请大声点！";
            else if (gvLanguage == "JPN") usermsg = "もっと大きな声で話してください！";
            else if (gvLanguage == "VTN") usermsg = "Xin hãy nói to hơn!";
            else if (gvLanguage == "INE") usermsg = "Tolong Bicara Lebih Keras!";
            break;

        case "힌트를 사용할 수 없습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Hints are not available.";
            else if (gvLanguage == "CHN") usermsg = "提示不可用.";
            else if (gvLanguage == "JPN") usermsg = "ヒントは利用できません。";
            else if (gvLanguage == "VTN") usermsg = "Không có gợi ý sẵn.";
            else if (gvLanguage == "INE") usermsg = "Petunjuk tidak tersedia.";
            break;

        case "관리자 모드에서는 테스트 결과가 저장되지 않습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Test results are not saved in manager mode.";
            else if (gvLanguage == "CHN") usermsg = "测试结果不会以管理器模式保存.";
            else if (gvLanguage == "JPN") usermsg = "テスト結果はマネージャーモードでは保存されません。";
            else if (gvLanguage == "VTN") usermsg = "Kết quả kiểm tra không được lưu trong chế độ quản lý.";
            else if (gvLanguage == "INE") usermsg = "Hasil pengujian tidak disimpan dalam mode manajer.";
            break;

        case "해당학습은 Step1 점수미달로 오늘은 수행할 수 없습니다. \n 익일 학습하여 주십시오.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You did not reach the cut-off point for Step1. \n Please try again tomorrow.";
            else if (gvLanguage == "CHN") usermsg = "您没有获得第一步的截止点. \n 请第二天学习.";
            else if (gvLanguage == "JPN") usermsg = "Step1の合格点を取得できませんでした。 \n 明日もう一度学習してください。";
            else if (gvLanguage == "VTN") usermsg = "Bạn đạt điểm dưới trung bình ở Step 1. \n Hãy học lại vào ngày mai.";
            else if (gvLanguage == "INE") usermsg = "Anda tidak mendapatkan titik cut-off untuk Step1. \n Belajar hari berikutnya.";
            break;

        case "금일 획득 가능한 포인트를 초과했습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You have exceeded the number of points you can earn for today.";
            else if (gvLanguage == "CHN") usermsg = "您已经超出了今天可以赚取的积分.";
            else if (gvLanguage == "JPN") usermsg = "本日獲得可能なポイントを超えました。";
            else if (gvLanguage == "VTN") usermsg = "Bạn đã vượt quá số điểm tối đa có thể kiếm được trong ngày.";
            else if (gvLanguage == "INE") usermsg = "Anda telah melampaui poin yang bisa Anda dapatkan hari ini.";
            break;

        case "금일 획득 가능한 포인트를 초과했습니다. \n 익일 학습하여 주십시오.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You have exceeded the number of points you can earn for today. \n Please study again tomorrow.";
            else if (gvLanguage == "CHN") usermsg = "您已经超出了今天可以赚取的积分. \n 请第二天学习.";
            else if (gvLanguage == "JPN") usermsg = "本日獲得可能なポイントを超えました。 \n 明日また勉強してください。";
            else if (gvLanguage == "VTN") usermsg = "Bạn đã vượt quá số điểm tối đa có thể kiếm được trong ngày. \n Hãy học tiếp vào ngày mai.";
            else if (gvLanguage == "INE") usermsg = "Anda telah melampaui poin yang bisa Anda dapatkan hari ini. \n Belajar hari berikutnya.";
            break;

        case "스토리를 2회 읽은 후 학습할 수 있는 Listen & Repeat 모드가 설정되어 있습니다. (My Info > 화면 설정에서 변경 가능합니다":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "The Listen & Repeat mode is set to learn after reading the story twice. (You can change it in My Info -> Screen Settings)";
            else if (gvLanguage == "CHN") usermsg = "聆听和重复模式设置为在阅读故事两次后学习。 （您可以在我的信息 -> 屏幕设置中更改它）";
            else if (gvLanguage == "JPN") usermsg = "Listen & Repeat モードは、ストーリーを2回読んだ後学習するように設定されています。 （[マイ情報]-> [画面設定]で変更できます）";
            else if (gvLanguage == "VTN") usermsg = "Chế độ Listen & Repeat đang được bật, và sẽ bắt đầu sau khi bạn đọc xong sách 1 lần. (Đê tắt tính năng này, vui lòng vào Thông tin học viên > Cài đặt màn hình) [Xác nhận] [Không hiện ra nữa]";
            else if (gvLanguage == "INE") usermsg = "Mode Dengar & Ulangi diatur untuk belajar setelah membaca cerita dua kali. (Anda dapat mengubahnya di Info Saya -> Pengaturan Layar)";
            break;

        case "이어서 보시겠습니까?":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Would you like to continue from where you left off?";
            else if (gvLanguage == "CHN") usermsg = "您要先阅读书签吗？";
            else if (gvLanguage == "JPN") usermsg = "中断したところから続行しますか？";
            else if (gvLanguage == "VTN") usermsg = "Bạn có muốn tiếp tục từ bookmark lần trước không?";
            else if (gvLanguage == "INE") usermsg = "Apakah Anda ingin membaca bookmark terlebih dahulu?";
            break;

        case "이미 한 번 포인트를 획득한 학습입니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You have already completed and earned the study points for this book.";
            else if (gvLanguage == "CHN") usermsg = "您已经完成了相关的学习课程, \n 并获得了学习要点.";
            else if (gvLanguage == "JPN") usermsg = "すでにポイントを獲得した学習です。";
            else if (gvLanguage == "VTN") usermsg = "Bạn đã nhận điểm một lần với quyển sách này.";
            else if (gvLanguage == "INE") usermsg = "Anda telah menyelesaikan sesi studi yang relevan \n dan memperoleh poin studi.";
            break;

        case "두번째 학습을 통과하여도":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Completing and passing the Study for a second time";
            else if (gvLanguage == "CHN") usermsg = "即使您在第二节课中取得及格分数，";
            else if (gvLanguage == "JPN") usermsg = "2回目のレッスンに合格しても、";
            else if (gvLanguage == "VTN") usermsg = "Hoàn thành đọc sách lần thứ 2,";
            else if (gvLanguage == "INE") usermsg = "Bahkan jika Anda lulus pelajaran kedua,";
            break;

        case "50% 포인트만 획득할 수 있습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "you can only get 50% points.";
            else if (gvLanguage == "CHN") usermsg = "您可能会获得总积分的50％.";
            else if (gvLanguage == "JPN") usermsg = "50％のポイントしか獲得できません。";
            else if (gvLanguage == "VTN") usermsg = "bạn chỉ nhận được 50% số điểm.";
            else if (gvLanguage == "INE") usermsg = "Anda hanya bisa mendapatkan 50% poin.";
            break;

        case "계속 학습하시겠습니까?":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Would you like to continue with the session?";
            else if (gvLanguage == "CHN") usermsg = "您将继续会议吗?";
            else if (gvLanguage == "JPN") usermsg = "学習を続行しますか?";
            else if (gvLanguage == "VTN") usermsg = "Bạn có muốn tiếp tục không?";
            else if (gvLanguage == "INE") usermsg = "Apakah Anda akan melanjutkan sesi?";
            break;

        case "이미 두 번 포인트를 획득한 학습입니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You have already completed this Study twice \n and have earn all the possible points.";
            else if (gvLanguage == "CHN") usermsg = "您已经完成了相关的学习课程 \n 并获得了两次学习点.";
            else if (gvLanguage == "JPN") usermsg = "すでにポイントを2回獲得した学習です。";
            else if (gvLanguage == "VTN") usermsg = "Bạn đã hoàn thành xong bài tập \n và nhận được điểm đọc sách lần hai.";
            else if (gvLanguage == "INE") usermsg = "Anda telah menyelesaikan sesi studi yang relevan \n dan memperoleh poin studi dua kali.";
            break;

        case "학습을 완료하여도 \n 더 이상 포인트를 획득할 수 없습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You will not be able to earn more points for this Study \n even after completion.";
            else if (gvLanguage == "CHN") usermsg = "即使完成, 您也可能无法获得额外的积分.";
            else if (gvLanguage == "JPN") usermsg = "学習を完了しても、これ以上ポイントを獲得できません。";
            else if (gvLanguage == "VTN") usermsg = "Bạn không thể nhận thêm điểm nữa \n cho dù bạn có làm bài tập.";
            else if (gvLanguage == "INE") usermsg = "Anda mungkin tidak mendapatkan poin tambahan \n bahkan setelah selesai.";
            break;

        case "수평 해상도는 1200 이상이어야합니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "The horizontal resolution must be at least 1200.";
            else if (gvLanguage == "CHN") usermsg = "水平分辨率必須至少為1200.";
            else if (gvLanguage == "JPN") usermsg = "水平解像度は1200以上でなければなりません。";
            else if (gvLanguage == "VTN") usermsg = "Chiều ngang tối thiểu phải là 1200.";
            else if (gvLanguage == "INE") usermsg = "Resolusi horisontal harus setidaknya 1200.";
            break;

        case "영어로만 진행하시겠습니까?":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Do you want to proceed in English only?";
            else if (gvLanguage == "CHN") usermsg = "您是否只想使用英语？";
            else if (gvLanguage == "JPN") usermsg = "英語のみで進めますか？";
            else if (gvLanguage == "VTN") usermsg = "Bạn có muốn chỉ xem nội dung bằng tiếng Anh?";
            else if (gvLanguage == "INE") usermsg = "Apakah Anda ingin melanjutkan dalam bahasa Inggris saja?";
            break;

        case "빈칸을 채우세요.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Please fill in the blank.";
            else if (gvLanguage == "CHN") usermsg = "填空.";
            else if (gvLanguage == "JPN") usermsg = "空欄をうめてください。";
            else if (gvLanguage == "VTN") usermsg = "Hãy điền vào chỗ trống.";
            else if (gvLanguage == "INE") usermsg = "Isi bagian yang kosong.";
            break;

        case "이 책을 평가해 주세요!":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Rate this book!";
            else if (gvLanguage == "CHN") usermsg = "評價這本書！";
            else if (gvLanguage == "JPN") usermsg = "この本を評価してください！";
            else if (gvLanguage == "VTN") usermsg = "Vui lòng đánh giá quyển sách này!";
            else if (gvLanguage == "INE") usermsg = "Evaluasi Buku ini!";
            break;

        case "평가 후 학습이 시작 됩니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Study will begin after you rate the book.";
            else if (gvLanguage == "CHN") usermsg = "評估後，學習開始.";
            else if (gvLanguage == "JPN") usermsg = "評価後、学習が始まります。";
            else if (gvLanguage == "VTN") usermsg = "Đánh giá xong, bạn sẽ bắt đầu làm bài tập.";
            else if (gvLanguage == "INE") usermsg = "Setelah evaluasi, pembelajaran dimulai.";
            break;

        case "학습 리뷰를 시작합니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Start the Review.";
            else if (gvLanguage == "CHN") usermsg = "開始審閱.";
            else if (gvLanguage == "JPN") usermsg = "レビューを学習レビューを開始します。";
            else if (gvLanguage == "VTN") usermsg = "Hãy bắt đầu Xem lại.";
            else if (gvLanguage == "INE") usermsg = "Mulai meninjau.";
            break;

        case "리뷰 완료시 포인트는 제공되지 않습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Points cannot be earned during Review.";
            else if (gvLanguage == "CHN") usermsg = "審查完成後將不給分.";
            else if (gvLanguage == "JPN") usermsg = "レビュー完了時、ポイントは付与されません。";
            else if (gvLanguage == "VTN") usermsg = "Bạn không nhận được điểm đọc sách ở chế độ Xem lại.";
            else if (gvLanguage == "INE") usermsg = "Poin tidak akan diberikan sebelum penyelesaian tinjauan.";
            break;

        case "다시 읽기":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Read again";
            else if (gvLanguage == "CHN") usermsg = "再讀一次";
            else if (gvLanguage == "JPN") usermsg = "もう一度読む";
            else if (gvLanguage == "VTN") usermsg = "Đọc lại lần nữa";
            else if (gvLanguage == "INE") usermsg = "Baca lagi";
            break;

        case "정확한 정보가 아닙니다. \n 다시 시도 해 주세요.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Some of your information is not correct. \n Please try again.";
            else if (gvLanguage == "CHN") usermsg = "这不是准确的信息。 \n 请再试一遍.";
            else if (gvLanguage == "JPN") usermsg = "情報が正確ではありません。 \n もう一度やり直してください。";
            else if (gvLanguage == "VTN") usermsg = "Thông tin không chính xác. \n Vui lòng thử lại.";
            else if (gvLanguage == "INE") usermsg = "Ini bukan informasi yang akurat. \n Silakan coba lagi.";
            break;

        case "책 정보를 가져오지 못했습니다. \n 다시 시도 해 주세요.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Failed to get book information. \n Please try again.";
            else if (gvLanguage == "CHN") usermsg = "无法获取图书信息. \n 请重试.";
            else if (gvLanguage == "JPN") usermsg = "書籍情報を取得できませんでした. \n もう一度やり直してください。";
            else if (gvLanguage == "VTN") usermsg = "Không thể lấy thông tin sách. \n Vui lòng thử lại.";
            else if (gvLanguage == "INE") usermsg = "Gagal mendapatkan informasi buku. \n Silakan coba lagi.";
            break;

        case "Listen and Repeat는 1.0배속 만 가능합니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Listen And Repeat is only available at 1.0x speed.";
            else if (gvLanguage == "CHN") usermsg = "聆听和重复仅以1.0倍的速度提供.";
            else if (gvLanguage == "JPN") usermsg = "Listen & Repeat は、1.0倍速でのみ利用可能です。";
            else if (gvLanguage == "VTN") usermsg = "Nghe và Lặp lại chỉ khả dụng ở tốc độ 1.0x.";
            else if (gvLanguage == "INE") usermsg = "Listen And Repeat hanya tersedia pada kecepatan 1.0x.";
            break;

        case "Listen and Repeat모드에서는 지원하지 않습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "This function is not supported in Listen and Repeat mode.";
            else if (gvLanguage == "CHN") usermsg = "在“聆听并重复”模式下不支持此功能.";
            else if (gvLanguage == "JPN") usermsg = "Listen & Repeat モードではサポートされていません。";
            else if (gvLanguage == "VTN") usermsg = "Không có hỗ trợ chế độ Nghe và Lặp lại.";
            else if (gvLanguage == "INE") usermsg = "Ini tidak didukung dalam mode Listen And Repeat.";
            break;

        case "통과하기엔 점수가 부족해요.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You did not score enough points to pass.";
            else if (gvLanguage == "CHN") usermsg = "没有足够的分数通过.";
            else if (gvLanguage == "JPN") usermsg = "合格点が合格ラインに届きませんでした。";
            else if (gvLanguage == "VTN") usermsg = "Bạn không đủ điểm để vượt qua bài tập.";
            else if (gvLanguage == "INE") usermsg = "Tidak cukup skor untuk dilewati.";
            break;

        case "새로운 리딩 유닛을 획득했습니다!":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You gained a new reading unit!";
            else if (gvLanguage == "CHN") usermsg = "获得了新的读取单元！";
            else if (gvLanguage == "JPN") usermsg = "新しいリーディングユニットを獲得しました！";
            else if (gvLanguage == "VTN") usermsg = "Bạn đã nhận được một nhân vật hoạt hình mới!";
            else if (gvLanguage == "INE") usermsg = "Raih unit membaca baru!";
            break;

        case "내 학습 레벨과 일일 학습 목표가 변경되었습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "My learning level and daily learning goals have changed.";
            else if (gvLanguage == "CHN") usermsg = "我的学习水平和日常学习目标已经改变.";
            else if (gvLanguage == "JPN") usermsg = "私の学習レベルと一日学習目標が変更されました。";
            else if (gvLanguage == "VTN") usermsg = "Level và mục tiêu hàng ngày của tôi đã thay đổi.";
            else if (gvLanguage == "INE") usermsg = "Tingkat pembelajaran saya dan tujuan pembelajaran harian telah berubah.";
            break;

        case "비어있는 칸이 존재하거나, 단어수가 설정과 다릅니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "One or more of the blanks have not met the required word count.";
            else if (gvLanguage == "CHN") usermsg = "空的空间存在，或不同的文字和设置的数量.";
            else if (gvLanguage == "JPN") usermsg = "空欄があるか、単語数が設定と異なります。";
            else if (gvLanguage == "VTN") usermsg = "Vẫn còn ô trống chưa điền vào, chưa chính xác số lượng ký tự.";
            else if (gvLanguage == "INE") usermsg = "Ruang kosong ada, atau jumlah kata dan pengaturan yang berbeda.";
            break;

        case "녹음을 진행해주세요.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Please proceed with the recording.";
            else if (gvLanguage == "CHN") usermsg = "请录制继续进行.";
            else if (gvLanguage == "JPN") usermsg = "録音を行なってください。";
            else if (gvLanguage == "VTN") usermsg = "Vui lòng tiến hành ghi âm.";
            else if (gvLanguage == "INE") usermsg = "Lanjutkan dengan rekaman.";
            break;

        case "로그아웃 되었습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You are logged out.";
            else if (gvLanguage == "CHN") usermsg = "您已注销.";
            else if (gvLanguage == "JPN") usermsg = "ログアウトしました。";
            else if (gvLanguage == "VTN") usermsg = "Bạn đã đăng xuất.";
            else if (gvLanguage == "INE") usermsg = "Anda keluar.";
            break;

        case "장시간 사용이 없어 로그아웃됩니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You have been logged out due to inactivity.";
            else if (gvLanguage == "CHN") usermsg = "你不必长期使用将被注销.";
            else if (gvLanguage == "JPN") usermsg = "長時間使用しなかったため、ログアウトされました。";
            else if (gvLanguage == "VTN") usermsg = "Bạn sẽ được đăng xuất sau khi không sử dụng một thời gian dài.";
            else if (gvLanguage == "INE") usermsg = "Anda tidak memiliki penggunaan jangka panjang akan keluar.";
            break;

        case "이달의 첨삭":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Proofreading This Month";
            else if (gvLanguage == "CHN") usermsg = "本月的批阅";
            else if (gvLanguage == "JPN") usermsg = "今月の添削";
            else if (gvLanguage == "VTN") usermsg = "Bài viết chấm điểm tháng này";
            else if (gvLanguage == "INE") usermsg = "Koreksi bulan ini";
            break;

        case "목표 첨삭":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Proofreading Goals";
            else if (gvLanguage == "CHN") usermsg = "本月可接受批阅的数量";
            else if (gvLanguage == "JPN") usermsg = "校正の目標";
            else if (gvLanguage == "VTN") usermsg = "Số bài viết cần chấm điểm";
            else if (gvLanguage == "INE") usermsg = "Koreksi tujuan";
            break;

        case "완료 첨삭":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Proofreading Completed";
            else if (gvLanguage == "CHN") usermsg = "已完成的批阅";
            else if (gvLanguage == "JPN") usermsg = "校正が完了した添削";
            else if (gvLanguage == "VTN") usermsg = "Bài viết đã chấm điểm xong";
            else if (gvLanguage == "INE") usermsg = "Koreksi selesai";
            break;

        case "남은 첨삭":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Proofreading Remaining";
            else if (gvLanguage == "CHN") usermsg = "尚未批阅";
            else if (gvLanguage == "JPN") usermsg = "残りの添削";
            else if (gvLanguage == "VTN") usermsg = "Bài viết chưa chấm điểm";
            else if (gvLanguage == "INE") usermsg = "koreksi tersisa";
            break;

        case "첨삭을 받으시겠습니까?":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Do you want to have your writing proofread?";
            else if (gvLanguage == "CHN") usermsg = "您想接受批阅吗?";
            else if (gvLanguage == "JPN") usermsg = "文章の添削を希望しますか？";
            else if (gvLanguage == "VTN") usermsg = "Bạn có muốn chấm điểm bài viết này không?";
            else if (gvLanguage == "INE") usermsg = "Apakah kamu ingin tulisanmu dikoreksii?";
            break;

        case "첨삭 받기":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Yes, proofread my writing.";
            else if (gvLanguage == "CHN") usermsg = "是的";
            else if (gvLanguage == "JPN") usermsg = "添削を受ける";
            else if (gvLanguage == "VTN") usermsg = "Có, vui lòng chấm điểm.";
            else if (gvLanguage == "INE") usermsg = "Ya, koreksi tulisan saya.";
            break;

        case "안받기":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "No, thanks.";
            else if (gvLanguage == "CHN") usermsg = "不接受";
            else if (gvLanguage == "JPN") usermsg = "添削を受けない";
            else if (gvLanguage == "VTN") usermsg = "Không, cảm ơn.";
            else if (gvLanguage == "INE") usermsg = "Tidak, Terimakasih.";
            break;

        case "글쓰기를 하시겠습니까?":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Do you want to write?";
            else if (gvLanguage == "CHN") usermsg = "您想要开始写作吗?";
            else if (gvLanguage == "JPN") usermsg = "作文を行ないますか？";
            else if (gvLanguage == "VTN") usermsg = "Bạn có muốn chấm điểm bài viết này không?";
            else if (gvLanguage == "INE") usermsg = "Apakah kamu ingin menulis?";
            break;

        case "포인트를 획득했습니다!":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Points achieved!";
            else if (gvLanguage == "CHN") usermsg = "已获取积分!";
            else if (gvLanguage == "JPN") usermsg = "ポイントを獲得しました！";
            else if (gvLanguage == "VTN") usermsg = "Chúc mừng bạn đã nhận được điểm!";
            else if (gvLanguage == "INE") usermsg = "Poin tercapai!";
            break;

        case "내일 다시 시도해주세요.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Try again tomorrow.";
            else if (gvLanguage == "CHN") usermsg = "请明天再试.";
            else if (gvLanguage == "JPN") usermsg = "明日もう一度やり直してください。";
            else if (gvLanguage == "VTN") usermsg = "Hãy thử lại vào ngày mai.";
            else if (gvLanguage == "INE") usermsg = "Coba lagi besok.";
            break;

        case "크롬 브라우저에서 학습해주세요.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Please learn from your Chrome browser.";
            else if (gvLanguage == "CHN") usermsg = "请从您的Chrome浏览器学习。";
            else if (gvLanguage == "JPN") usermsg = "Chromeブラウザを利用して学習してください。";
            else if (gvLanguage == "VTN") usermsg = "Hãy học hỏi từ trình duyệt Chrome của mình.";
            else if (gvLanguage == "INE") usermsg = "Silakan belajar dari browser Chrome Anda.";
            break;

        case "이미 테스트를 진행했습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "I've already proceed with the test.";
            else if (gvLanguage == "CHN") usermsg = "我已经与测试继续进行。";
            else if (gvLanguage == "JPN") usermsg = "すでにテストを行ないました。";
            else if (gvLanguage == "VTN") usermsg = "Tôi đã tiến hành thử nghiệm.";
            else if (gvLanguage == "INE") usermsg = "Aku sudah melanjutkan dengan tes.";
            break;

        case "제한 줄 수를 초과했습니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Exceeded the number of lines permitted.";
            else if (gvLanguage == "CHN") usermsg = "超过了允许的行数。";
            else if (gvLanguage == "JPN") usermsg = "最大行数を超過しました。";
            else if (gvLanguage == "VTN") usermsg = "Vượt quá số dòng cho phép.";
            else if (gvLanguage == "INE") usermsg = "Melebihi jumlah baris yang diizinkan.";
            break;

        case "일일 목표를 달성했습니다!":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "You have reached your daily goal.";
            else if (gvLanguage == "CHN") usermsg = "你已经达到了你的每日目标。";
            else if (gvLanguage == "JPN") usermsg = "一日の目標を達成しました。";
            else if (gvLanguage == "VTN") usermsg = "Bạn đã đạt được mục tiêu hàng ngày của mình.";
            else if (gvLanguage == "INE") usermsg = "Anda telah mencapai tujuan harian Anda.";
            break;

        case "Re-Test는 하루에 한번만 할 수 있습니다. \n 내일 이후 다시 시도해주세요.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "ENG") usermsg = "Retests can only be completed once a day. \n Please try again tomorrow.";
            else if (gvLanguage == "CHN") usermsg = "重新测试每天只能进行一次。 \n 请第二天学习.";
            else if (gvLanguage == "JPN") usermsg = "Re-Testは一日1回のみ可能です。 \n 明日もう一度お試しください。";
            else if (gvLanguage == "VTN") usermsg = "Bạn chỉ có thể thực hiện Re-Test mỗi ngày một lần. \n Vui lòng thử lại vào ngày hôm.";
            else if (gvLanguage == "INE") usermsg = "Ujian ulang hanya bisa dilakukan sekali sehari. \n Silakan coba lagi besok.";
            break;

        case "이전 고객사에서 완료한 학습입니다. 새로 과제를 추가하시거나 본사(1599-0533)로 연락주시기 바랍니다.":
            if (gvLanguage == "KOR") usermsg = pText;
            else if (gvLanguage == "VTN") usermsg = "Đây là sách đã học xong ở tài khoản trước đây. Vui lòng thêm sách này vào To-do để học lại hoặc gọi đến hotline CSKH để được hỗ trợ.";
            else usermsg = "This assignment was completed in the previous site. Please add this as a new assignment or contact customer service(1599 - 0533) for further assistance.";
            break;

        default:
            usermsg = pText;
            break;
    }

    return usermsg;
}