/* =====================================================================
   PHOTO WALK BOOKING – form đặt dịch vụ 3 bước, hiệu ứng liquid glass
   Cách dùng: thêm 2 dòng trước </body> của trang chủ
     <script>window.PW_LANG = 'vi';</script>      (bản tiếng Trung: 'zh')
     <script src="photo_walk_booking.js"></script>
   Mọi link có href chứa "photo_walk" sẽ mở form này thay vì chuyển trang.
   ===================================================================== */
(function () {
  'use strict';
  if (window.PhotoWalkBooking) return;

  /* ---------------------------------------------------------------
     1) CẤU HÌNH – sửa giá, dịch vụ, giờ chụp, mã giảm giá ở đây
     --------------------------------------------------------------- */
  var LANG = window.PW_LANG === 'zh' ? 'zh' : 'vi';

  var CONFIG = {
    image: 'Vechungtoi_4.png',          // ảnh bên trái của form
    logo: 'logoduan.png',               // logo nhỏ
    times: ['05:30', '06:30', '08:00', '09:30', '15:30', '16:30', '17:30', '18:30'],
    services: [
      { id: 'pw1',    price: 150000, hours: 1,
        vi: { name: 'Photo Walk 1 giờ',       desc: 'Dạo phố ngắn cùng người đồng hành' },
        zh: { name: '摄影漫步 1 小时',          desc: '与本地伙伴轻松漫步拍照' } },
      { id: 'pw2',    price: 280000, hours: 2,
        vi: { name: 'Photo Walk 2 giờ',       desc: 'Nhiều điểm check-in, thong thả hơn' },
        zh: { name: '摄影漫步 2 小时',          desc: '更多打卡点，节奏更从容' } },
      { id: 'sunset', price: 340000, hours: 2,
        vi: { name: 'Hoàng hôn vịnh Hạ Long', desc: 'Chụp giờ vàng ven vịnh' },
        zh: { name: '下龙湾日落时刻',           desc: '海湾边的黄金时刻' } },
      { id: 'group',  price: 450000, hours: 3,
        vi: { name: 'Gia đình / nhóm bạn',    desc: 'Tối đa 6 người' },
        zh: { name: '家庭 / 朋友团',            desc: '最多 6 人' } }
    ],
    coupons: [
      { code: '3HILLS10', pct: 10,
        vi: 'Giảm 10% mọi dịch vụ', zh: '全部服务 9 折' },
      { code: 'PHOTO50K', amount: 50000, min: 250000,
        vi: 'Giảm 50.000đ cho đơn từ 250.000đ', zh: '满 250,000₫ 减 50,000₫' },
      { code: 'HALONG15', pct: 15, max: 60000,
        vi: 'Giảm 15%, tối đa 60.000đ', zh: '85 折，最高减 60,000₫' }
    ]
  };

  /* ---------------------------------------------------------------
     2) NGÔN NGỮ
     --------------------------------------------------------------- */
  var TEXT = {
    vi: {
      tag: 'Photo Walk', title: 'Photo Walk Hạ Long',
      lead: 'Dạo phố Hạ Long cùng người đồng hành bản địa – ghi lại những góc phố bình yên và khoảnh khắc ven vịnh theo nhịp của riêng bạn.',
      steps: ['Thông tin', 'Thanh toán', 'Hoàn tất'],
      fName: 'Họ và tên', fNamePh: 'Nguyễn Văn A', fService: 'Dịch vụ', fDate: 'Ngày chụp', fTime: 'Giờ chụp',
      eName: 'Vui lòng nhập họ tên', eSvc: 'Vui lòng chọn dịch vụ', eDate: 'Hãy chọn ngày chụp hợp lệ', eTime: 'Vui lòng chọn giờ chụp',
      subtotal: 'Tạm tính', toPay: 'Cần thanh toán', next: 'Tiếp tục', back: 'Quay lại', pay: 'Thanh toán',
      processing: 'Đang xử lý…', done: 'Hoàn tất', again: 'Đặt thêm',
      method: 'Phương thức thanh toán', eMethod: 'Vui lòng chọn phương thức thanh toán',
      promo: 'Ưu đãi & mã giảm giá', promoPh: 'Nhập mã giảm giá', apply: 'Áp dụng', remove: 'Bỏ mã',
      cInvalid: 'Mã giảm giá không hợp lệ', cNeedSvc: 'Hãy chọn dịch vụ trước khi dùng mã',
      cMin: 'Đơn tối thiểu {min} để dùng mã này', cOk: 'Đã áp dụng {code}: giảm {amt}', cGone: 'Mã {code} không còn phù hợp với dịch vụ này',
      rGuest: 'Khách', rService: 'Dịch vụ', rWhen: 'Thời gian', rDisc: 'Giảm giá', rTotal: 'Tổng cộng',
      ok1: 'Thanh toán thành công!', ok1b: 'Đặt lịch thành công!',
      okSub: 'Cảm ơn {name}, lịch Photo Walk của bạn đã được ghi nhận.',
      okLater: 'Bạn sẽ thanh toán sau khi buổi chụp hoàn tất.',
      code: 'Mã đặt lịch', paid: 'Đã thanh toán', toPayLater: 'Thanh toán sau',
      close: 'Đóng', prevA: 'Trang trước', nextA: 'Trang sau', hours: 'giờ', ccy: 'đ',
      methods: {
        momo: ['Ví MoMo', 'Xác nhận bằng ứng dụng MoMo'],
        card: ['Thẻ ngân hàng', 'Xác nhận bằng thẻ ngân hàng của bạn'],
        qr: ['Mã QR', 'Quét mã bằng ứng dụng ngân hàng'],
        alipay: ['Alipay', 'Xác nhận bằng Alipay'],
        wechat: ['WeChat Pay', 'Xác nhận bằng WeChat Pay'],
        later: ['Thanh toán khi hoàn tất việc', 'Trả sau khi buổi chụp hoàn tất']
      }
    },
    zh: {
      tag: '摄影漫步', title: '下龙摄影漫步',
      lead: '与本地伙伴一起漫步下龙，按照自己的节奏，记录宁静的街角与海湾边的美好时刻。',
      steps: ['填写信息', '支付', '完成'],
      fName: '姓名', fNamePh: '请输入您的姓名', fService: '服务项目', fDate: '拍摄日期', fTime: '拍摄时间',
      eName: '请输入姓名', eSvc: '请选择服务项目', eDate: '请选择有效的拍摄日期', eTime: '请选择拍摄时间',
      subtotal: '小计', toPay: '应付金额', next: '继续', back: '返回', pay: '立即支付',
      processing: '处理中…', done: '完成', again: '再预约一次',
      method: '支付方式', eMethod: '请选择支付方式',
      promo: '优惠与折扣码', promoPh: '输入折扣码', apply: '使用', remove: '取消',
      cInvalid: '折扣码无效', cNeedSvc: '请先选择服务项目再使用折扣码',
      cMin: '订单满 {min} 才可使用此折扣码', cOk: '已使用 {code}：优惠 {amt}', cGone: '折扣码 {code} 不适用于当前服务',
      rGuest: '顾客', rService: '服务', rWhen: '时间', rDisc: '优惠', rTotal: '合计',
      ok1: '支付成功！', ok1b: '预约成功！',
      okSub: '谢谢 {name}，您的摄影漫步预约已记录。',
      okLater: '拍摄完成后再付款即可。',
      code: '预约编号', paid: '已支付', toPayLater: '稍后支付',
      close: '关闭', prevA: '上一页', nextA: '下一页', hours: '小时', ccy: '₫',
      methods: {
        momo: ['MoMo 钱包', '通过 MoMo 应用确认'],
        card: ['银行卡', '使用您的银行卡确认'],
        qr: ['二维码', '用银行 App 扫码支付'],
        alipay: ['支付宝', '通过支付宝确认'],
        wechat: ['微信支付', '通过微信支付确认'],
        later: ['服务完成后付款', '拍摄完成后再付款']
      }
    }
  };
  var T = TEXT[LANG];

  /* ---------------------------------------------------------------
     3) CSS (liquid glass)
     --------------------------------------------------------------- */
  var CSS = `
.pwb{--teal:#0f4a47;--teal2:#1f7a78;--gold:#a6824a;--ink:#12302f;--sub:#4d6665;
  position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:22px;
  font-family:"Be Vietnam Pro","Noto Sans SC","PingFang SC","Microsoft YaHei",system-ui,-apple-system,"Segoe UI",sans-serif;
  color:var(--ink);opacity:0;visibility:hidden;overscroll-behavior:contain;
  transition:opacity .35s ease,visibility 0s linear .35s}
.pwb.is-open{opacity:1;visibility:visible;transition:opacity .35s ease}
html.pwb-lock{overflow:hidden !important}
.pwb *,.pwb *::before,.pwb *::after{box-sizing:border-box}
.pwb button,.pwb input{font:inherit;color:inherit}
.pwb button{cursor:pointer}
.pwb [hidden]{display:none !important}

.pwb__backdrop{position:absolute;inset:0;background:rgba(6,24,28,.52);
  -webkit-backdrop-filter:blur(16px) saturate(130%);backdrop-filter:blur(16px) saturate(130%)}
.pwb__blobs{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.pwb__blobs i{position:absolute;border-radius:50%;filter:blur(70px);opacity:.85;animation:pwbFloat 16s ease-in-out infinite alternate}
.pwb__blobs i:nth-child(1){width:42vmax;height:42vmax;left:6%;top:-12%;background:#3f9aa0}
.pwb__blobs i:nth-child(2){width:36vmax;height:36vmax;right:4%;bottom:-14%;background:#d9a85c;animation-delay:-5s}
.pwb__blobs i:nth-child(3){width:28vmax;height:28vmax;right:30%;top:8%;background:#f08a97;opacity:.55;animation-delay:-9s}
@keyframes pwbFloat{to{transform:translate3d(6vmax,4vmax,0) scale(1.12)}}

.pwb__stage{position:relative;z-index:1;display:flex;align-items:center;gap:16px;width:min(1130px,100%)}
.pwb__card{position:relative;flex:1 1 auto;min-width:0;display:grid;grid-template-columns:minmax(0,.86fr) minmax(0,1.14fr);
  height:min(720px,calc(100vh - 44px));border-radius:38px;overflow:hidden;
  background:linear-gradient(135deg,rgba(255,255,255,.7),rgba(255,255,255,.4));
  -webkit-backdrop-filter:blur(30px) saturate(190%);backdrop-filter:blur(30px) saturate(190%);
  border:1px solid rgba(255,255,255,.75);
  box-shadow:inset 0 2px 1px rgba(255,255,255,.95),inset 0 -2px 3px rgba(255,255,255,.4),inset 0 0 46px rgba(255,255,255,.28),
    0 44px 100px rgba(4,20,26,.5);
  opacity:0;transform:translateY(16px) scale(.955);
  transition:transform .55s cubic-bezier(.2,.9,.25,1.04),opacity .4s ease}
.pwb.is-open .pwb__card{opacity:1;transform:none}
.pwb__card::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(460px circle at var(--mx,28%) var(--my,0%),rgba(255,255,255,.65),rgba(255,255,255,0) 62%)}
.pwb__card>*{position:relative;z-index:1}

/* nút đóng + mũi tên (kính nổi) */
.pwb .pwb__close,.pwb .pwb__arrow{display:grid;place-items:center;border-radius:50%;border:1px solid rgba(255,255,255,.7);
  background:linear-gradient(135deg,rgba(255,255,255,.55),rgba(255,255,255,.22));color:#fff;
  -webkit-backdrop-filter:blur(18px) saturate(180%);backdrop-filter:blur(18px) saturate(180%);
  box-shadow:inset 0 1.5px 1px rgba(255,255,255,.9),inset 0 -1px 2px rgba(255,255,255,.3),0 10px 28px rgba(0,0,0,.28);
  transition:transform .25s cubic-bezier(.2,.9,.25,1.2),opacity .25s,background .25s}
.pwb__close{position:absolute;z-index:3;top:22px;right:26px;width:46px;height:46px}
.pwb__close:hover{transform:rotate(90deg) scale(1.06)}
.pwb__arrow{flex:0 0 58px;width:58px;height:58px}
.pwb__arrow svg,.pwb__close svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}
.pwb__arrow:not(:disabled):hover{transform:scale(1.1)}
.pwb__arrow:not(:disabled):active{transform:scale(.94)}
.pwb__arrow:disabled{opacity:.28;cursor:default}
.pwb__close:focus-visible,.pwb__arrow:focus-visible{outline:3px solid #fff;outline-offset:3px}

/* cột trái: thông tin */
.pwb__info{display:flex;flex-direction:column;gap:14px;padding:16px;min-height:0}
.pwb__img{position:relative;flex:0 0 40%;border-radius:28px;overflow:hidden;
  background:linear-gradient(135deg,#3f9aa0,#0f4a47 60%,#d9a85c);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.5),0 14px 30px rgba(15,74,71,.25)}
.pwb__img img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.04);transition:transform 1.2s ease}
.pwb.is-open .pwb__img img{transform:scale(1)}
.pwb__img::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(6,30,32,.5));pointer-events:none}
.pwb__tag{position:absolute;z-index:1;left:14px;bottom:14px;padding:7px 14px;border-radius:99px;font-size:12.5px;font-weight:700;letter-spacing:.04em;color:#fff;
  background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.6);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.7)}
.pwb__ibody{display:flex;flex-direction:column;gap:10px;min-height:0;padding:0 8px;flex:1}
.pwb__brand{display:flex;align-items:center;gap:10px}
.pwb__brand img{width:38px;height:38px;border-radius:12px;object-fit:cover;box-shadow:0 5px 14px rgba(0,0,0,.18)}
.pwb__title{margin:0;font-size:21px;line-height:1.2;font-weight:800;letter-spacing:-.01em}
.pwb__lead{margin:0;font-size:13.5px;line-height:1.6;color:var(--sub)}
.pwb__receipt{margin:auto 0 4px;padding:14px 16px;border-radius:22px;background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.8);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.95),inset 0 -1px 2px rgba(255,255,255,.4);display:grid;gap:8px;font-size:13px}
.pwb__receipt div{display:flex;justify-content:space-between;gap:14px}
.pwb__receipt dt{color:var(--sub);white-space:nowrap}
.pwb__receipt dd{margin:0;font-weight:600;text-align:right;overflow-wrap:anywhere}
.pwb__receipt .is-total{padding-top:9px;border-top:1px dashed rgba(15,74,71,.25);font-size:15px}
.pwb__receipt .is-total dd{color:var(--teal);font-weight:800}

/* cột phải */
.pwb__main{display:flex;flex-direction:column;min-width:0;min-height:0;padding:20px 24px 20px 10px}
.pwb__steps{list-style:none;margin:0 62px 14px 0;padding:5px;display:flex;gap:4px;border-radius:99px;
  background:rgba(255,255,255,.42);border:1px solid rgba(255,255,255,.75);box-shadow:inset 0 1px 2px rgba(15,74,71,.08),inset 0 1px 1px rgba(255,255,255,.9)}
.pwb__steps li{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 6px;border-radius:99px;font-size:12.5px;font-weight:600;color:var(--sub);
  transition:background .4s,color .4s,box-shadow .4s;white-space:nowrap}
.pwb__steps b{display:grid;place-items:center;flex:0 0 22px;width:22px;height:22px;border-radius:50%;font-size:11.5px;background:rgba(15,74,71,.12);transition:background .4s,color .4s}
.pwb__steps li.is-active{color:var(--teal);background:linear-gradient(180deg,rgba(255,255,255,.95),rgba(255,255,255,.65));
  box-shadow:0 4px 12px rgba(15,74,71,.16),inset 0 1px 1px #fff}
.pwb__steps li.is-active b,.pwb__steps li.is-done b{background:var(--teal);color:#fff}
.pwb__viewport{flex:1;min-height:0;overflow:hidden;overflow:clip}
.pwb__track{display:flex;height:100%;transform:translateX(calc(var(--step,0) * -100%));transition:transform .65s cubic-bezier(.22,.9,.2,1)}
.pwb__slide{flex:0 0 100%;min-width:0;height:100%;overflow-y:auto;padding:4px 6px 6px 4px;scrollbar-width:thin;scrollbar-color:rgba(15,74,71,.3) transparent}
.pwb__slide::-webkit-scrollbar{width:6px}.pwb__slide::-webkit-scrollbar-thumb{background:rgba(15,74,71,.28);border-radius:9px}

.pwb__field{margin-bottom:14px}
.pwb__label{display:block;margin:0 0 7px 4px;font-size:12.5px;font-weight:700;letter-spacing:.03em;color:var(--teal)}
.pwb__input{width:100%;height:50px;padding:0 18px;border-radius:18px;outline:0;border:1px solid rgba(255,255,255,.85);
  background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,.78));font-size:15px;
  box-shadow:inset 0 2px 5px rgba(15,74,71,.1),inset 0 1px 1px rgba(255,255,255,.9),0 1px 0 rgba(255,255,255,.6);
  transition:box-shadow .25s,border-color .25s}
.pwb__input::placeholder{color:#8aa09f}
.pwb__input:focus{border-color:var(--teal2);box-shadow:inset 0 2px 5px rgba(15,74,71,.08),0 0 0 4px rgba(31,122,120,.22)}
.pwb__err{display:block;min-height:0;max-height:0;overflow:hidden;margin:0 0 0 6px;font-size:12px;font-weight:600;color:#c2314a;opacity:0;transition:max-height .25s,opacity .25s,margin .25s}
.is-error>.pwb__err,.is-error .pwb__err{max-height:24px;opacity:1;margin-top:6px}
.is-error .pwb__input,.is-error .pwb__opts{border-color:#e0647b !important;box-shadow:0 0 0 4px rgba(224,100,123,.18)}
.is-shake{animation:pwbShake .45s}
@keyframes pwbShake{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}

.pwb__opts{display:grid;gap:10px;border-radius:22px}
.pwb__opts--svc{grid-template-columns:1fr 1fr}
.pwb__opts--time{grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}
.pwb__opts--pay{grid-template-columns:1fr 1fr;gap:8px}
.pwb__opt{position:relative;text-align:left;border-radius:20px;border:1px solid rgba(255,255,255,.85);
  background:linear-gradient(180deg,rgba(255,255,255,.7),rgba(255,255,255,.42));
  box-shadow:inset 0 1px 1px #fff,inset 0 -1px 2px rgba(255,255,255,.4),0 4px 12px rgba(15,74,71,.08);
  transition:transform .25s cubic-bezier(.2,.9,.25,1.2),box-shadow .25s,background .25s,border-color .25s}
.pwb__opt:not(:disabled):hover{transform:translateY(-2px);box-shadow:inset 0 1px 1px #fff,0 10px 22px rgba(15,74,71,.16)}
.pwb__opt:focus-visible{outline:3px solid var(--teal2);outline-offset:2px}
.pwb__opt:disabled{opacity:.4;cursor:not-allowed}
.pwb__opt[aria-checked="true"]{border-color:var(--teal2);
  background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(190,232,226,.7));
  box-shadow:inset 0 1px 1px #fff,0 0 0 3px rgba(31,122,120,.28),0 12px 26px rgba(15,74,71,.2);transform:translateY(-1px)}
.pwb__opt .tick{position:absolute;top:10px;right:10px;width:20px;height:20px;border-radius:50%;background:var(--teal2);display:grid;place-items:center;
  transform:scale(0);transition:transform .3s cubic-bezier(.2,.9,.25,1.5)}
.pwb__opt .tick svg{width:12px;height:12px;stroke:#fff;fill:none;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}
.pwb__opt[aria-checked="true"] .tick{transform:scale(1)}

.pwb__svc{padding:13px 14px;display:flex;flex-direction:column;gap:3px;min-height:92px}
.pwb__svc .n{font-size:14px;font-weight:700;line-height:1.25;padding-right:22px}
.pwb__svc .d{font-size:12px;color:var(--sub);line-height:1.35}
.pwb__svc .p{margin-top:auto;font-size:14.5px;font-weight:800;color:var(--teal)}
.pwb__svc .p em{font-style:normal;font-weight:600;font-size:11.5px;color:var(--sub);margin-left:6px}
.pwb__time{height:40px;padding:0;text-align:center;border-radius:14px;font-size:13.5px;font-weight:600}
.pwb__pay{display:flex;align-items:center;gap:10px;padding:9px 12px;min-height:56px}
.pwb__pay .ic{flex:0 0 38px;width:38px;height:38px;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,.18)}
.pwb__pay .ic svg{display:block;width:100%;height:100%}
.pwb__pay .t{font-size:13px;font-weight:700;line-height:1.25;padding-right:14px}
.pwb__hint{min-height:18px;margin:8px 4px 0;font-size:12.5px;color:var(--sub)}

.pwb__h{display:flex;align-items:center;justify-content:space-between;margin:0 0 9px 4px;font-size:12.5px;font-weight:700;letter-spacing:.03em;color:var(--teal)}
.pwb__promo{margin-top:12px;padding-top:12px;border-top:1px dashed rgba(15,74,71,.25)}
.pwb__crow{display:flex;gap:8px}
.pwb__crow .pwb__input{flex:1;min-width:0;height:46px;text-transform:uppercase;letter-spacing:.06em;font-weight:600}
.pwb__crow .pwb__input::placeholder{text-transform:none;letter-spacing:0;font-weight:400}
.pwb__btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:50px;padding:0 26px;border-radius:99px;border:1px solid rgba(255,255,255,.55);
  font-weight:700;font-size:15px;white-space:nowrap;transition:transform .25s cubic-bezier(.2,.9,.25,1.2),box-shadow .25s,filter .25s,opacity .25s}
.pwb .pwb__btn--pri{color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.3);
  background:linear-gradient(180deg,rgba(255,255,255,.42),rgba(255,255,255,0) 52%),linear-gradient(135deg,#2a8f8c,#0f4a47);
  box-shadow:inset 0 1.5px 1px rgba(255,255,255,.7),inset 0 -2px 4px rgba(0,0,0,.2),0 12px 26px rgba(15,74,71,.38)}
.pwb .pwb__btn--sec{color:var(--teal);background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,.5));
  box-shadow:inset 0 1px 1px #fff,0 6px 16px rgba(15,74,71,.12)}
.pwb__btn:not(:disabled):hover{transform:translateY(-2px);filter:brightness(1.06)}
.pwb__btn:not(:disabled):active{transform:translateY(0) scale(.97)}
.pwb__btn:disabled{opacity:.75;cursor:progress}
.pwb__btn:focus-visible{outline:3px solid var(--teal2);outline-offset:3px}
.pwb__btn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.pwb__btn--sm{height:46px;padding:0 20px;font-size:14px}
.pwb__btn--icon{width:50px;padding:0;flex:0 0 50px}
.pwb__cmsg{min-height:18px;margin:6px 4px 0;font-size:12.5px;font-weight:600}
.pwb__cmsg.ok{color:#17805a}.pwb__cmsg.bad{color:#c2314a}
.pwb__offers{display:grid;gap:7px;margin-top:6px}
.pwb__offer{display:flex;align-items:center;gap:10px;padding:7px 12px;border-radius:16px;min-height:38px;text-align:left}
.pwb__offer code{flex:0 0 auto;padding:3px 9px;border-radius:8px;background:rgba(166,130,74,.18);color:#7a5a27;font-weight:800;font-size:12px;letter-spacing:.06em;border:1px dashed rgba(166,130,74,.7)}
.pwb__offer span{font-size:12.5px;color:var(--sub);line-height:1.3}
.pwb__offer[aria-checked="true"] span{color:var(--teal);font-weight:600}

/* chân form: tổng tiền + nút */
.pwb__foot{display:flex;align-items:center;gap:12px;margin-top:14px;padding:12px 12px 12px 20px;border-radius:99px;
  background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(255,255,255,.42));border:1px solid rgba(255,255,255,.85);
  box-shadow:inset 0 1px 1px #fff,inset 0 -1px 2px rgba(255,255,255,.4),0 10px 26px rgba(15,74,71,.14)}
.pwb__total{flex:1;min-width:0;overflow:hidden;display:flex;flex-direction:column;line-height:1.15}
.pwb__total .l{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--sub)}
.pwb__total .v{display:flex;align-items:baseline;gap:8px}
.pwb__total strong{font-size:23px;font-weight:800;color:var(--teal);letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.pwb__total s{font-size:13px;color:#8aa09f}
.pwb__foot.is-final{display:none}

/* trang 3: thành công */
.pwb__ok{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6px;padding:6px 8px}
.pwb__badge{position:relative;width:92px;height:92px;margin-bottom:8px}
.pwb__badge::before,.pwb__badge::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid rgba(31,122,120,.45);opacity:0}
.pwb__badge svg{position:relative;z-index:1;width:100%;height:100%;overflow:visible}
.pwb__badge .disc{fill:url(#pwbG);}
.pwb__badge .chk{fill:none;stroke:#fff;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:60;stroke-dashoffset:60}
.pwb__ok.is-run .pwb__badge{animation:pwbPop .7s cubic-bezier(.2,.9,.25,1.5) both}
.pwb__ok.is-run .pwb__badge::before{animation:pwbRing 1.6s .3s ease-out infinite}
.pwb__ok.is-run .pwb__badge::after{animation:pwbRing 1.6s 1s ease-out infinite}
.pwb__ok.is-run .chk{animation:pwbDraw .6s .45s ease forwards}
@keyframes pwbPop{from{transform:scale(.3);opacity:0}to{transform:none;opacity:1}}
@keyframes pwbRing{from{transform:scale(1);opacity:.8}to{transform:scale(1.7);opacity:0}}
@keyframes pwbDraw{to{stroke-dashoffset:0}}
.pwb__ok h3{margin:0;font-size:25px;font-weight:800;letter-spacing:-.01em;color:var(--teal)}
.pwb__ok p{margin:0;font-size:14px;color:var(--sub);line-height:1.55;max-width:340px}
.pwb__code{margin:8px 0 4px;padding:10px 22px;border-radius:18px;background:rgba(255,255,255,.6);border:1px dashed rgba(15,74,71,.4);
  box-shadow:inset 0 1px 1px #fff;font-size:12px;color:var(--sub)}
.pwb__code strong{display:block;font-size:20px;letter-spacing:.12em;color:var(--ink);font-weight:800}
.pwb__okrows{width:100%;max-width:360px;margin-top:6px;padding:14px 18px;border-radius:22px;background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.85);
  box-shadow:inset 0 1px 1px #fff;display:grid;gap:8px;text-align:left;font-size:13px}
.pwb__okrows div{display:flex;justify-content:space-between;gap:14px}
.pwb__okrows dt{color:var(--sub)}.pwb__okrows dd{margin:0;font-weight:700;text-align:right}

@media (max-width:1100px){.pwb__stage{gap:10px}.pwb__arrow{flex-basis:48px;width:48px;height:48px}}
@media (max-width:820px){
  .pwb{padding:10px}
  .pwb .pwb__arrow{display:none}
  .pwb__card{grid-template-columns:1fr;height:calc(100vh - 20px);height:calc(100dvh - 20px);border-radius:30px}
  .pwb__info{display:none}
  .pwb__main{padding:16px 14px}
  .pwb__steps{margin-right:54px}
  .pwb__close{top:14px;right:14px;width:42px;height:42px}
  .pwb__opts--time{grid-template-columns:repeat(4,1fr)}
}
@media (max-width:430px){.pwb__total .l{font-size:10px}.pwb__foot{padding:10px 10px 10px 16px;gap:8px}.pwb__total strong{font-size:20px}.pwb__total s{display:none}.pwb__btn--pri{padding:0 16px}.pwb__opts--svc,.pwb__opts--pay{grid-template-columns:1fr}.pwb__steps li span{display:none}.pwb__btn{padding:0 18px}}
@media (prefers-reduced-motion:reduce){.pwb *,.pwb *::before,.pwb *::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}}
`;

  /* ---------------------------------------------------------------
     4) ICON
     --------------------------------------------------------------- */
  var ICON = {
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
    tick: '<i class="tick"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i>',
    momo: '<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#a50064"/><text x="20" y="26" text-anchor="middle" font-size="17" font-weight="800" fill="#fff" font-family="Arial,sans-serif">mo</text></svg>',
    card: '<svg viewBox="0 0 40 40"><defs><linearGradient id="pwbC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f6fed"/><stop offset="1" stop-color="#0b2a6f"/></linearGradient></defs><rect width="40" height="40" fill="url(#pwbC)"/><rect x="8" y="12" width="24" height="16" rx="3" fill="none" stroke="#fff" stroke-width="2"/><path d="M8 17h24" stroke="#fff" stroke-width="3"/><path d="M12 24h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
    qr: '<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#1c2b2a"/><g fill="none" stroke="#fff" stroke-width="2.2"><rect x="8" y="8" width="9" height="9" rx="1.5"/><rect x="23" y="8" width="9" height="9" rx="1.5"/><rect x="8" y="23" width="9" height="9" rx="1.5"/></g><g fill="#fff"><rect x="11" y="11" width="3" height="3"/><rect x="26" y="11" width="3" height="3"/><rect x="11" y="26" width="3" height="3"/><rect x="23" y="23" width="4" height="4"/><rect x="29" y="23" width="3" height="3"/><rect x="23" y="29" width="3" height="3"/><rect x="29" y="29" width="3" height="3"/></g></svg>',
    alipay: '<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#1677ff"/><text x="20" y="28" text-anchor="middle" font-size="22" font-weight="700" fill="#fff" font-family="\'Noto Sans SC\',\'PingFang SC\',\'Microsoft YaHei\',sans-serif">支</text></svg>',
    wechat: '<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#07c160"/><ellipse cx="17" cy="17" rx="8.5" ry="7" fill="#fff"/><ellipse cx="24.5" cy="23.5" rx="7.5" ry="6" fill="#fff" stroke="#07c160" stroke-width="1.5"/><circle cx="14.2" cy="15.5" r="1.1" fill="#07c160"/><circle cx="19.8" cy="15.5" r="1.1" fill="#07c160"/><circle cx="22" cy="22" r=".95" fill="#07c160"/><circle cx="27" cy="22" r=".95" fill="#07c160"/></svg>',
    later: '<svg viewBox="0 0 40 40"><defs><linearGradient id="pwbL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9a85c"/><stop offset="1" stop-color="#a6824a"/></linearGradient></defs><rect width="40" height="40" fill="url(#pwbL)"/><circle cx="20" cy="20" r="9.5" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M15.5 20.5l3.5 3.5 6-7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var METHOD_ORDER = ['momo', 'card', 'qr', 'alipay', 'wechat', 'later'];

  /* ---------------------------------------------------------------
     5) TIỆN ÍCH
     --------------------------------------------------------------- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var money = function (n) { return Math.round(n).toLocaleString('vi-VN') + T.ccy; };
  var todayStr = function () { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var fmtDate = function (s) { if (!s) return ''; var p = s.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var svcInfo = function (s) { return s[LANG]; };

  var root, els = {}, built = false, state, lastFocus = null, busy = false;

  function freshState() { return { step: 0, name: '', svc: null, date: '', time: '', method: null, coupon: null, code: '' }; }
  function svc() { return CONFIG.services.filter(function (s) { return s.id === state.svc; })[0] || null; }

  function calc() {
    var s = svc(), sub = s ? s.price : 0, disc = 0, c = state.coupon;
    if (c && sub) {
      disc = c.pct ? Math.round(sub * c.pct / 100) : (c.amount || 0);
      if (c.max) disc = Math.min(disc, c.max);
      disc = Math.min(disc, sub);
    }
    return { sub: sub, disc: disc, total: sub - disc };
  }

  /* ---------------------------------------------------------------
     6) DỰNG GIAO DIỆN
     --------------------------------------------------------------- */
  function build() {
    var style = document.createElement('style');
    style.id = 'pwb-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var svcHTML = CONFIG.services.map(function (s) {
      var t = svcInfo(s);
      return '<button type="button" class="pwb__opt pwb__svc" role="radio" aria-checked="false" data-id="' + s.id + '">' +
        '<span class="n">' + esc(t.name) + '</span><span class="d">' + esc(t.desc) + '</span>' +
        '<span class="p">' + money(s.price) + '<em>' + s.hours + ' ' + T.hours + '</em></span>' + ICON.tick + '</button>';
    }).join('');

    var timeHTML = CONFIG.times.map(function (t) {
      return '<button type="button" class="pwb__opt pwb__time" role="radio" aria-checked="false" data-t="' + t + '">' + t + '</button>';
    }).join('');

    var payHTML = METHOD_ORDER.map(function (m) {
      return '<button type="button" class="pwb__opt pwb__pay" role="radio" aria-checked="false" data-m="' + m + '">' +
        '<span class="ic">' + ICON[m] + '</span><span class="t">' + esc(T.methods[m][0]) + '</span>' + ICON.tick + '</button>';
    }).join('');

    var offerHTML = CONFIG.coupons.map(function (c) {
      return '<button type="button" class="pwb__opt pwb__offer" role="checkbox" aria-checked="false" data-code="' + c.code + '"><code>' + c.code + '</code><span>' + esc(c[LANG]) + '</span></button>';
    }).join('');

    var stepsHTML = T.steps.map(function (s, i) { return '<li data-i="' + i + '"><b>' + (i + 1) + '</b><span>' + esc(s) + '</span></li>'; }).join('');

    root = document.createElement('div');
    root.className = 'pwb';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'pwb-title');
    root.innerHTML =
      '<div class="pwb__backdrop" data-close></div>' +
      '<div class="pwb__blobs" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<button type="button" class="pwb__close" data-close aria-label="' + T.close + '">' + ICON.x + '</button>' +
      '<div class="pwb__stage">' +
        '<button type="button" class="pwb__arrow" data-dir="-1" aria-label="' + T.prevA + '">' + ICON.left + '</button>' +
        '<div class="pwb__card">' +
          '<aside class="pwb__info">' +
            '<div class="pwb__img"><img src="' + CONFIG.image + '" alt="" onerror="this.style.display=\'none\'"><span class="pwb__tag">' + esc(T.tag) + '</span></div>' +
            '<div class="pwb__ibody">' +
              '<div class="pwb__brand"><img src="' + CONFIG.logo + '" alt="" onerror="this.style.display=\'none\'"><h2 class="pwb__title" id="pwb-title">' + esc(T.title) + '</h2></div>' +
              '<p class="pwb__lead">' + esc(T.lead) + '</p>' +
              '<dl class="pwb__receipt">' +
                '<div><dt>' + T.rGuest + '</dt><dd data-r="name">—</dd></div>' +
                '<div><dt>' + T.rService + '</dt><dd data-r="svc">—</dd></div>' +
                '<div><dt>' + T.rWhen + '</dt><dd data-r="when">—</dd></div>' +
                '<div data-r-row="disc" hidden><dt>' + T.rDisc + '</dt><dd data-r="disc"></dd></div>' +
                '<div class="is-total"><dt>' + T.rTotal + '</dt><dd data-r="total">0' + T.ccy + '</dd></div>' +
              '</dl>' +
            '</div>' +
          '</aside>' +
          '<section class="pwb__main">' +
            '<ol class="pwb__steps" aria-label="Steps">' + stepsHTML + '</ol>' +
            '<div class="pwb__viewport"><div class="pwb__track">' +
              /* Trang 1 */
              '<div class="pwb__slide" data-slide="0">' +
                '<div class="pwb__field" data-f="name"><label class="pwb__label" for="pwb-name">' + T.fName + '</label>' +
                  '<input class="pwb__input" id="pwb-name" type="text" autocomplete="name" maxlength="60" placeholder="' + esc(T.fNamePh) + '"><small class="pwb__err">' + T.eName + '</small></div>' +
                '<div class="pwb__field" data-f="svc"><span class="pwb__label" id="pwb-svc-l">' + T.fService + '</span>' +
                  '<div class="pwb__opts pwb__opts--svc" role="radiogroup" aria-labelledby="pwb-svc-l">' + svcHTML + '</div><small class="pwb__err">' + T.eSvc + '</small></div>' +
                '<div class="pwb__field" data-f="date"><label class="pwb__label" for="pwb-date">' + T.fDate + '</label>' +
                  '<input class="pwb__input" id="pwb-date" type="date" min="' + todayStr() + '"><small class="pwb__err">' + T.eDate + '</small></div>' +
                '<div class="pwb__field" data-f="time"><span class="pwb__label" id="pwb-time-l">' + T.fTime + '</span>' +
                  '<div class="pwb__opts pwb__opts--time" role="radiogroup" aria-labelledby="pwb-time-l" style="margin-top:0">' + timeHTML + '</div><small class="pwb__err">' + T.eTime + '</small></div>' +
              '</div>' +
              /* Trang 2 */
              '<div class="pwb__slide" data-slide="1">' +
                '<div class="pwb__field" data-f="method" style="margin-bottom:0"><span class="pwb__label" id="pwb-pay-l">' + T.method + '</span>' +
                  '<div class="pwb__opts pwb__opts--pay" role="radiogroup" aria-labelledby="pwb-pay-l">' + payHTML + '</div>' +
                  '<small class="pwb__err">' + T.eMethod + '</small></div>' +
                '<p class="pwb__hint" data-hint aria-live="polite"></p>' +
                '<div class="pwb__promo"><div class="pwb__h"><span>' + T.promo + '</span></div>' +
                  '<div class="pwb__crow"><input class="pwb__input" id="pwb-code" type="text" autocomplete="off" spellcheck="false" placeholder="' + esc(T.promoPh) + '" aria-label="' + esc(T.promoPh) + '">' +
                  '<button type="button" class="pwb__btn pwb__btn--sec pwb__btn--sm" data-apply>' + T.apply + '</button></div>' +
                  '<p class="pwb__cmsg" data-cmsg aria-live="polite"></p>' +
                  '<div class="pwb__offers" role="group">' + offerHTML + '</div></div>' +
              '</div>' +
              /* Trang 3 */
              '<div class="pwb__slide" data-slide="2"><div class="pwb__ok" data-ok></div></div>' +
            '</div></div>' +
            '<footer class="pwb__foot">' +
              '<div class="pwb__total" aria-live="polite"><span class="l" data-tl>' + T.subtotal + '</span><span class="v"><strong data-total>0' + T.ccy + '</strong><s data-old hidden></s></span></div>' +
              '<button type="button" class="pwb__btn pwb__btn--sec pwb__btn--icon" data-back hidden aria-label="' + T.back + '" title="' + T.back + '">' + ICON.left + '</button>' +
              '<button type="button" class="pwb__btn pwb__btn--pri" data-next><span data-next-t>' + T.next + '</span>' + ICON.right + '</button>' +
            '</footer>' +
          '</section>' +
        '</div>' +
        '<button type="button" class="pwb__arrow" data-dir="1" aria-label="' + T.nextA + '">' + ICON.right + '</button>' +
      '</div>';
    document.body.appendChild(root);

    var q = function (s) { return root.querySelector(s); };
    els = {
      card: q('.pwb__card'), name: q('#pwb-name'), date: q('#pwb-date'), code: q('#pwb-code'),
      total: q('[data-total]'), old: q('[data-old]'), tl: q('[data-tl]'), foot: q('.pwb__foot'),
      next: q('[data-next]'), nextT: q('[data-next-t]'), back: q('[data-back]'), hint: q('[data-hint]'), cmsg: q('[data-cmsg]'),
      prev: q('.pwb__arrow[data-dir="-1"]'), fwd: q('.pwb__arrow[data-dir="1"]'),
      slides: [].slice.call(root.querySelectorAll('.pwb__slide')), steps: [].slice.call(root.querySelectorAll('.pwb__steps li')),
      ok: q('[data-ok]')
    };
    bind();
    built = true;
  }

  /* ---------------------------------------------------------------
     7) SỰ KIỆN
     --------------------------------------------------------------- */
  function bind() {
    root.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('[data-close]')) return close();
      var b;
      if ((b = t.closest('.pwb__svc'))) return pickService(b.dataset.id);
      if ((b = t.closest('.pwb__time'))) return pickTime(b.dataset.t);
      if ((b = t.closest('.pwb__pay'))) return pickMethod(b.dataset.m);
      if ((b = t.closest('.pwb__offer'))) return toggleOffer(b.dataset.code);
      if (t.closest('[data-apply]')) return applyTyped();
      if (t.closest('[data-next]')) return onNext();
      if (t.closest('[data-back]')) return go(state.step - 1);
      if ((b = t.closest('.pwb__arrow'))) { return b.dataset.dir === '1' ? onNext() : go(state.step - 1); }
      if (t.closest('[data-again]')) return reset(true);
      if (t.closest('[data-done]')) return close();
    });

    root.querySelector('.pwb__viewport').addEventListener('scroll', function (e) { e.target.scrollLeft = 0; });
    els.name.addEventListener('input', function () { state.name = els.name.value.trim(); clearErr('name'); summary(); });
    els.date.addEventListener('input', function () { state.date = els.date.value; clearErr('date'); syncTimes(); summary(); });
    els.code.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); applyTyped(); } });

    els.card.addEventListener('pointermove', function (e) {
      var r = els.card.getBoundingClientRect();
      els.card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      els.card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && state.step === 0 && e.target === els.name) { e.preventDefault(); onNext(); }
    });
    /* Esc / Tab bắt ở cấp document để vẫn hoạt động khi tiêu điểm đang ở ngoài form */
    document.addEventListener('keydown', function (e) {
      if (!root.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.stopPropagation(); return close(); }
      if (e.key === 'Tab') {
        if (!root.contains(document.activeElement)) { e.preventDefault(); var f0 = root.querySelector('.pwb__close'); if (f0) f0.focus(); return; }
        trapFocus(e);
      }
    });
  }

  function trapFocus(e) {
    var f = [].slice.call(root.querySelectorAll('button,input,[tabindex]:not([tabindex="-1"])')).filter(function (n) {
      return !n.disabled && !n.hidden && n.offsetParent !== null && !n.closest('[inert]');
    });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------------------------------------------------------------
     8) LOGIC CHỌN
     --------------------------------------------------------------- */
  function setChecked(sel, test) {
    [].forEach.call(root.querySelectorAll(sel), function (n) { n.setAttribute('aria-checked', test(n) ? 'true' : 'false'); });
  }
  function clearErr(k) { var f = root.querySelector('[data-f="' + k + '"]'); if (f) f.classList.remove('is-error'); }
  function showErr(k) { var f = root.querySelector('[data-f="' + k + '"]'); if (f) { f.classList.add('is-error'); } return f; }

  function pickService(id) {
    state.svc = id; clearErr('svc');
    setChecked('.pwb__svc', function (n) { return n.dataset.id === id; });
    if (state.coupon && !evalCoupon(state.coupon.code).ok) {
      var gone = state.coupon.code; state.coupon = null; syncOffers();
      setMsg(T.cGone.replace('{code}', gone), 'bad');
    }
    summary();
  }
  function pickTime(t) {
    state.time = t; clearErr('time');
    setChecked('.pwb__time', function (n) { return n.dataset.t === t; });
    summary();
  }
  function syncTimes() {
    var today = els.date.value === todayStr(), now = new Date(), cur = pad(now.getHours()) + ':' + pad(now.getMinutes());
    [].forEach.call(root.querySelectorAll('.pwb__time'), function (n) { n.disabled = today && n.dataset.t <= cur; });
    if (state.time && today && state.time <= cur) { state.time = ''; setChecked('.pwb__time', function () { return false; }); }
  }
  function pickMethod(m) {
    state.method = m; clearErr('method');
    setChecked('.pwb__pay', function (n) { return n.dataset.m === m; });
    els.hint.textContent = T.methods[m][1];
    summary();
  }

  /* mã giảm giá */
  function evalCoupon(raw) {
    var code = String(raw || '').trim().toUpperCase();
    var c = CONFIG.coupons.filter(function (x) { return x.code === code; })[0];
    if (!c) return { ok: false, msg: T.cInvalid };
    var s = svc();
    if (!s) return { ok: false, msg: T.cNeedSvc };
    if (c.min && s.price < c.min) return { ok: false, msg: T.cMin.replace('{min}', money(c.min)) };
    return { ok: true, c: c };
  }
  function setMsg(t, kind) { els.cmsg.textContent = t || ''; els.cmsg.className = 'pwb__cmsg' + (kind ? ' ' + kind : ''); }
  function syncOffers() {
    setChecked('.pwb__offer', function (n) { return !!state.coupon && n.dataset.code === state.coupon.code; });
    els.code.value = state.coupon ? state.coupon.code : els.code.value;
  }
  function applyCoupon(code) {
    var r = evalCoupon(code);
    if (!r.ok) { state.coupon = null; syncOffers(); setMsg(r.msg, 'bad'); summary(); return; }
    state.coupon = r.c; syncOffers(); summary();
    setMsg(T.cOk.replace('{code}', r.c.code).replace('{amt}', money(calc().disc)), 'ok');
  }
  function applyTyped() { applyCoupon(els.code.value); }
  function toggleOffer(code) {
    if (state.coupon && state.coupon.code === code) { state.coupon = null; els.code.value = ''; syncOffers(); setMsg(''); summary(); }
    else { els.code.value = code; applyCoupon(code); }
  }

  /* ---------------------------------------------------------------
     9) CẬP NHẬT HIỂN THỊ
     --------------------------------------------------------------- */
  function tween(el, to) {
    var from = el._v || 0; el._v = to; cancelAnimationFrame(el._r);
    if (reduce || from === to) { el.textContent = money(to); return; }
    var t0 = performance.now(), dur = 420;
    var f = function (t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = money(from + (to - from) * e);
      if (k < 1) el._r = requestAnimationFrame(f);
    };
    el._r = requestAnimationFrame(f);
  }

  function summary() {
    var s = svc(), c = calc(), set = function (k, v) { root.querySelector('[data-r="' + k + '"]').textContent = v; };
    set('name', state.name || '—');
    set('svc', s ? svcInfo(s).name : '—');
    set('when', (state.date || state.time) ? ((state.time || '') + (state.time && state.date ? ' · ' : '') + fmtDate(state.date)) : '—');
    var dr = root.querySelector('[data-r-row="disc"]'); dr.hidden = !c.disc;
    set('disc', c.disc ? '−' + money(c.disc) : '');
    set('total', money(c.total));
    tween(els.total, c.total);
    els.old.hidden = !c.disc; els.old.textContent = c.disc ? money(c.sub) : '';
  }

  function paintStep() {
    var n = state.step;
    root.style.setProperty('--step', n);
    els.slides.forEach(function (sl, i) { sl.inert = i !== n; sl.setAttribute('aria-hidden', i !== n ? 'true' : 'false'); });
    els.steps.forEach(function (li, i) {
      li.classList.toggle('is-active', i === n);
      var done = i < n || n === 2;
      li.classList.toggle('is-done', done);
      li.querySelector('b').textContent = done ? '✓' : (i + 1);
    });
    els.tl.textContent = n === 0 ? T.subtotal : T.toPay;
    els.foot.classList.toggle('is-final', n === 2);
    els.back.hidden = n !== 1;
    els.nextT.textContent = n === 0 ? T.next : n === 1 ? T.pay : T.done;
    els.next.querySelector('svg').style.display = n === 2 ? 'none' : '';
    els.prev.disabled = n !== 1;
    els.fwd.disabled = n === 2 || n === 1;
    els.fwd.title = n === 1 ? T.pay : '';
    var sl = els.slides[n]; if (sl) sl.scrollTop = 0;
  }

  function go(n) {
    if (n < 0 || n > 2 || busy) return;
    state.step = n; paintStep();
    setTimeout(function () {
      var f = n === 0 ? els.name : n === 1 ? root.querySelector('.pwb__pay[aria-checked="true"]') || root.querySelector('.pwb__pay') : root.querySelector('[data-done]');
      if (f) f.focus({ preventScroll: true });
    }, reduce ? 0 : 480);
  }

  /* ---------------------------------------------------------------
     10) TIẾP TỤC / THANH TOÁN
     --------------------------------------------------------------- */
  function shake(node) { if (!node) return; node.classList.remove('is-shake'); void node.offsetWidth; node.classList.add('is-shake'); setTimeout(function () { node.classList.remove('is-shake'); }, 500); }

  function validate0() {
    var bad = [];
    if (state.name.length < 2) bad.push('name');
    if (!state.svc) bad.push('svc');
    if (!state.date || state.date < todayStr()) bad.push('date');
    if (!state.time) bad.push('time');
    var first = null;
    bad.forEach(function (k) { var f = showErr(k); if (!first) first = f; shake(f); });
    if (first) {
      first.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      var focusable = first.querySelector('input,button:not(:disabled)'); if (focusable && focusable.tagName === 'INPUT') focusable.focus({ preventScroll: true });
    }
    return !bad.length;
  }

  function onNext() {
    if (busy) return;
    if (state.step === 0) { if (validate0()) go(1); return; }
    if (state.step === 1) {
      if (!state.method) { var f = showErr('method'); shake(f); return; }
      return pay();
    }
    if (state.step === 2) close();
  }

  function pay() {
    busy = true;
    var label = els.nextT.textContent;
    els.next.disabled = true; els.back.disabled = true; els.nextT.textContent = T.processing;
    setTimeout(function () {
      busy = false; els.next.disabled = false; els.back.disabled = false;
      var chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', c = '';
      for (var i = 0; i < 5; i++) c += chars[Math.floor(Math.random() * chars.length)];
      state.code = '3H-PW-' + c;
      renderSuccess();
      go(2);
      var s = svc(), k = calc();
      try {
        window.dispatchEvent(new CustomEvent('photowalk:booked', { detail: {
          code: state.code, name: state.name, service: s && s.id, serviceName: s && svcInfo(s).name,
          date: state.date, time: state.time, method: state.method, coupon: state.coupon && state.coupon.code,
          subtotal: k.sub, discount: k.disc, total: k.total, lang: LANG } }));
      } catch (e) {}
    }, reduce ? 0 : 1500);
  }

  function renderSuccess() {
    var s = svc(), k = calc(), later = state.method === 'later';
    els.ok.classList.remove('is-run');
    els.ok.innerHTML =
      '<div class="pwb__badge"><svg viewBox="0 0 104 104" aria-hidden="true"><defs><linearGradient id="pwbG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3fb59c"/><stop offset="1" stop-color="#0f4a47"/></linearGradient></defs>' +
        '<circle class="disc" cx="52" cy="52" r="46"/><circle cx="52" cy="52" r="45" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="2"/><path class="chk" d="M32 54l14 14 27-30"/></svg></div>' +
      '<h3>' + (later ? T.ok1b : T.ok1) + '</h3>' +
      '<p>' + esc(T.okSub.replace('{name}', state.name)) + (later ? ' ' + esc(T.okLater) : '') + '</p>' +
      '<div class="pwb__code">' + T.code + '<strong>' + state.code + '</strong></div>' +
      '<dl class="pwb__okrows">' +
        '<div><dt>' + T.rService + '</dt><dd>' + esc(svcInfo(s).name) + '</dd></div>' +
        '<div><dt>' + T.rWhen + '</dt><dd>' + state.time + ' · ' + fmtDate(state.date) + '</dd></div>' +
        '<div><dt>' + T.method + '</dt><dd>' + esc(T.methods[state.method][0]) + '</dd></div>' +
        '<div><dt>' + (later ? T.toPayLater : T.paid) + '</dt><dd>' + money(k.total) + '</dd></div>' +
      '</dl>' +
      '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;justify-content:center">' +
        '<button type="button" class="pwb__btn pwb__btn--sec pwb__btn--sm" data-again>' + T.again + '</button>' +
        '<button type="button" class="pwb__btn pwb__btn--pri pwb__btn--sm" data-done>' + T.done + '</button></div>';
    void els.ok.offsetWidth; els.ok.classList.add('is-run');
  }

  /* ---------------------------------------------------------------
     11) MỞ / ĐÓNG / ĐẶT LẠI
     --------------------------------------------------------------- */
  function reset(reopen) {
    state = freshState();
    els.name.value = ''; els.date.value = ''; els.code.value = '';
    setChecked('.pwb__opt', function () { return false; });
    [].forEach.call(root.querySelectorAll('.is-error'), function (n) { n.classList.remove('is-error'); });
    [].forEach.call(root.querySelectorAll('.pwb__time'), function (n) { n.disabled = false; });
    els.hint.textContent = ''; setMsg('');
    els.total._v = 0; summary(); paintStep();
    if (reopen) setTimeout(function () { els.name.focus({ preventScroll: true }); }, 400);
  }

  function open() {
    if (!built) { build(); state = freshState(); reset(false); }
    lastFocus = document.activeElement;
    [].forEach.call(document.querySelectorAll('.svc-dd.open'), function (n) { n.classList.remove('open'); });
    if (lastFocus && lastFocus.blur) lastFocus.blur();
    document.documentElement.classList.add('pwb-lock');
    root.style.display = 'flex';
    void root.offsetWidth;
    root.classList.add('is-open');
    setTimeout(function () { if (state.step === 0) els.name.focus({ preventScroll: true }); }, reduce ? 0 : 450);
  }

  function close() {
    if (!built || busy) return;
    root.classList.remove('is-open');
    document.documentElement.classList.remove('pwb-lock');
    var wasDone = state.step === 2;
    setTimeout(function () {
      if (root.classList.contains('is-open')) return;
      root.style.display = 'none';
      if (wasDone) reset(false);
    }, reduce ? 0 : 420);
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }

  /* Bắt mọi link tới photo_walk (menu nav + dropdown "Dịch vụ") */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="photo_walk"]');
    if (!a || a.closest('.pwb')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault(); e.stopPropagation();
    open();
  }, true);

  window.PhotoWalkBooking = { open: open, close: close, config: CONFIG };
})();
