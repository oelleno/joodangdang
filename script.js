function handleTimeSelect(selectElement, timeOfDay) {
  if (selectElement.value !== '') {
    const checkbox = selectElement.parentElement.querySelector('input[type="checkbox"]');
    checkbox.checked = true;
  }
}


// Function to update admission fee based on membership selection
function updateAdmissionFee() {
  const membershipSelect = document.getElementById('membership');
  const admissionFeeInput = document.getElementById('admission_fee');

  if (membershipSelect && admissionFeeInput) {
    if (membershipSelect.value === 'New') {
      admissionFeeInput.value = '33,000';
    } else if (membershipSelect.value === 'Renew' || membershipSelect.value === 'Upgrade') {
      admissionFeeInput.value = '0';
    } else {
      admissionFeeInput.value = '';
    }
    admissionFeeInput.style.backgroundColor = '#f5f5f5';
    admissionFeeInput.readOnly = true;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const membershipSelect = document.getElementById('membership');
  if (membershipSelect) {
    updateAdmissionFee();
    membershipSelect.addEventListener('change', updateAdmissionFee);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.querySelector(".canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const colors = document.getElementsByClassName("jsColor");

    const INITIAL_COLOR = "#000000";
    canvas.width = 180;  // Match canvas element width
    canvas.height = 50;  // Match canvas element height

    ctx.strokeStyle = "#2c2c2c";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = INITIAL_COLOR;
    ctx.fillStyle = INITIAL_COLOR;
    ctx.lineWidth = 2.5;
  }
});

let painting = false;
let filling = false;

function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.querySelector(".canvas");
  if (canvas) {
    canvas.addEventListener('click', function(e) {
      e.preventDefault();

      const popup = document.createElement('div');
      popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        z-index: 1000;
      `;

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
      `;

      const popupCanvas = document.createElement('canvas');
      popupCanvas.width = 400;
      popupCanvas.height = 200;
      popupCanvas.style.border = '1px solid #ccc';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '서명 완료';
      closeBtn.style.cssText = `
        display: block;
        margin: 10px auto 0;
        padding: 5px 20px;
        border: none;
        background: #0078D7;
        color: white;
        border-radius: 5px;
        cursor: pointer;
      `;

      popup.appendChild(popupCanvas);
      popup.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.appendChild(popup);

      const popupCtx = popupCanvas.getContext('2d');
      popupCtx.strokeStyle = '#000000';
      popupCtx.lineWidth = 2;
      popupCtx.lineCap = 'round';

      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;

      function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const rect = popupCanvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        popupCtx.beginPath();
        popupCtx.moveTo(lastX, lastY);
        popupCtx.lineTo(x, y);
        popupCtx.stroke();
        [lastX, lastY] = [x, y];
      }

      popupCanvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        const rect = popupCanvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      });

      popupCanvas.addEventListener('mousemove', draw);
      popupCanvas.addEventListener('mouseup', () => isDrawing = false);
      popupCanvas.addEventListener('mouseleave', () => isDrawing = false);

      popupCanvas.addEventListener('touchstart', function(e) {
        isDrawing = true;
        const rect = popupCanvas.getBoundingClientRect();
        lastX = e.touches[0].clientX - rect.left;
        lastY = e.touches[0].clientY - rect.top;
      });

      popupCanvas.addEventListener('touchmove', draw);
      popupCanvas.addEventListener('touchend', () => isDrawing = false);

      closeBtn.addEventListener('click', () => {
        // Copy signature to original canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(popupCanvas, 0, 0, canvas.width, canvas.height);
        document.body.removeChild(overlay);
        document.body.removeChild(popup);
      });
    });
  }
});

function sendit() {
  const name = document.getElementById('userid'); // 이름
  const contact = document.getElementById('contact'); // 연락처
  const birthdate = document.getElementById('userpw_re'); // 생년월일
  const membership = document.getElementById('membership'); // 회원권 선택
  const rentalMonths = document.getElementById('rental_months'); // 운동복 대여 개월수
  const lockerMonths = document.getElementById('locker_months'); // 라커 대여 개월수
  const exerciseGoals = document.getElementsByName('goal'); // 운동목적
  const otherGoal = document.getElementById('other'); // 기타 입력 칸
  const paymentMethods = document.getElementsByName('payment'); // 결제 방법
  const zipcode = document.getElementById('sample6_postcode'); // 주소
  const referralSources = document.getElementsByName('referral'); // 가입경로 

  // 정규식
  const expNameText = /^[가-힣]+$/;
  const expContactText = /^\d{3}-\d{4}-\d{4}$/; // 연락처 형식 체크

  if (name.value == '') {
    alert('이름을 입력하세요');
    name.focus();
    return false;
  }

  if (!/^[가-힣]{2,5}$/.test(name.value)) {
    alert('이름을 한글로 입력해주세요');
    name.focus();
    return false;
  }

  if (contact.value == '') {
    alert('연락처를 입력하세요');
    contact.focus();
    return false;
  }

  if (!expContactText.test(contact.value)) { // 연락처 형식 체크
    alert('연락처 형식을 확인하세요 (예: 000-0000-0000)');
    contact.focus();
    return false;
  }


  if (membership.value == '') {
    alert('회원권 선택을 해주세요');
    membership.focus();
    return false;
  }

  if (rentalMonths.value == '' || rentalMonths.value < 1) {
    alert('운동복 대여 개월수를 입력해주세요');
    rentalMonths.focus();
    return false;
  }

  if (lockerMonths.value == '' || lockerMonths.value < 0) {
    alert('라커 대여 개월수를 입력해주세요');
    lockerMonths.focus();
    return false;
  }

  let count = 0;

  for (let i in exerciseGoals) {
    if (exerciseGoals[i].checked) {
      count++;
    }
  }

  if (count == 0) {
    alert('운동목적을 선택하세요');
    return false;
  }

  // 기타 항목 체크
  if (otherGoal.value.trim() !== '') {
    count++;
  }

  // 결제 방법 체크
  let paymentSelected = false;
  for (let i in paymentMethods) {
    if (paymentMethods[i].checked) {
      paymentSelected = true;
      break;
    }
  }

  if (!paymentSelected) {
    alert('결제 방법을 선택하세요');
    return false;
  }


  // 가입경로 체크
  let referralSelected = false;
  for (let i in referralSources) {
    if (referralSources[i].checked) {
      referralSelected = true;
      break;
    }
  }

  if (!referralSelected) {
    alert('가입경로를 선택하세요');
    return false;
  }

  if (zipcode.value == '') {
    alert('주소를 입력하세요');
    zipcode.focus();
    return false;
  }

  return true;
}

function formatBirthdate(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length === 6) {
    value = '19' + value;
  }

  if (value.length === 8) {
    const year = value.substring(0, 4);
    const month = value.substring(4, 6);
    const day = value.substring(6, 8);
    input.value = `${year}-${month}-${day}`;
  }
}

function moveFocus() {
  const ssn1 = document.getElementById('ssn1');
  if (ssn1.value.length >= 6) {
    document.getElementById('ssn2').focus();
  }
}

function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, ''); // 숫자만 남기기

  if (value.length >= 11) {
      value = value.substring(0, 11); // 최대 11자리로 제한
      value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (value.length > 7) {
      value = value.replace(/(\d{3})(\d{4})/, '$1-$2');
  } else if (value.length > 3) {
      value = value.replace(/(\d{3})/, '$1-');
  }

  input.value = value; // 변환된 값 설정
}

// 📌 입력 필드에서 자동 변환 적용
document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("contact");
  if (phoneInput) {
      phoneInput.addEventListener("input", function () {
          formatPhoneNumber(this);
      });
  }
});


// 회원권 가격 자동입력 함수
document.addEventListener("DOMContentLoaded", function () {
    const membershipSelect = document.getElementById("membership");
    const admissionFeeInput = document.getElementById("admission_fee");

    // ✅ 1. 먼저 함수 정의
    function updateAdmissionFee() {
        if (!membershipSelect || !admissionFeeInput) return; // 요소가 없으면 실행 중단

        let fee = 0;
        if (membershipSelect.value === "New") {
            fee = 33000;
        }

        admissionFeeInput.value = fee.toLocaleString("ko-KR"); // 한국식 콤마 표시
        admissionFeeInput.style.backgroundColor = "#f5f5f5";
        admissionFeeInput.readOnly = true;
    }

    // ✅ 2. 페이지 로드 시 기본 값 설정
    if (membershipSelect) {
        updateAdmissionFee(); // 페이지 로드 시 자동 적용
        membershipSelect.addEventListener("change", updateAdmissionFee); // 변경 시 업데이트
    }
});


function formatCurrency(input) {
  let value = input.value.replace(/[^\d]/g, "");
  value = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(value);
  value = value.replace("₩", "").trim();
  input.value = value;
}

function formatMonths(input) {
  let value = input.value.replace(/[^0-9]/g, '');
  if (value) {
    input.value = value + '개월';
  }
}