(function (global) {
    let sundayNumbers = []; // Đảm bảo mảng sundayNumbers được khởi tạo
    let codeNumbers = [];
    function processLiturgicalWeeks(currentDate, endDate, sundayNumberPrefix, sundayNumber, weekBeforeLent, codeNumbers, sundayNumbers, isPentecostSeason = false) {
        while (currentDate < endDate) {
            sundayNumbers.push({
                date: new Date(currentDate),
                weekNumber: sundayNumber
            });

            let prefix = isPentecostSeason
                ? sundayNumber >= 10 ? `5${sundayNumber}` : `50${sundayNumber}`
                : `${sundayNumberPrefix}${sundayNumber}`;

            codeNumbers.push({
                date: new Date(currentDate),
                code: `${prefix}0` // Mã Chủ Nhật
            });

            for (let i = 1; i <= 6; i++) {
                currentDate.setDate(currentDate.getDate() + 1);
                codeNumbers.push({
                    date: new Date(currentDate),
                    code: `${prefix}${i}` // Mã ngày thường
                });
            }

            weekBeforeLent = sundayNumber;
            sundayNumber++;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return { sundayNumber, weekBeforeLent, currentDate };
    }

    // Hàm để cập nhật mã codeNumbers cho những ngày lễ kính thánh không vào chủ nhật
function updateCodeNumbersForMultipleDates(year, codePrefix, codeNumbers) {
    // Mảng các ngày cần cập nhật (để bên trong hàm)
    const datesToUpdate = [
        '11-09', '11-30', '09-08', '05-31', '12-03', '01-25',
        '02-22', '04-25', '05-03', '05-14', '07-03',
        '07-22', '07-25', '08-10', '08-24', '09-21',
        '09-29', '10-01', '10-18', '10-28'
    ];

    const easterDate = getEasterDate(year);
    const holySaturday = new Date(easterDate);
    holySaturday.setDate(easterDate.getDate() - 1); // Tính ngày Thứ Bảy Tuần Thánh
    const octaveEaster = new Date(easterDate);
    octaveEaster.setDate(easterDate.getDate() + 8); // Bát nhật Phục Sinh

    datesToUpdate.forEach(dateString => {
        // Tách ngày và tháng từ chuỗi dateString
        let [month, day] = dateString.split('-');
        // Tạo đối tượng Date với year, month và day
        let date = new Date(year, parseInt(month) - 1, parseInt(day)); // Tháng trong Date là 0-based nên cần trừ 1

        // Kiểm tra xem ngày có nằm trong khoảng từ Thứ Bảy Tuần Thánh đến Bát Nhật Phục Sinh
        const isOctaveEaster = date.getTime() >= holySaturday.getTime() && date.getTime() <= octaveEaster.getTime();

        // Nếu ngày không phải là Chủ Nhật và nằm trong bát nhật Phục Sinh
        if (date.getDay() !== 0 ) {
            let code = `7${day}${month}`;

            // Tìm kiếm mã đã tồn tại
            let existingCodeIndex = codeNumbers.findIndex(item => item.date.getTime() === date.getTime());
	    
             if(isOctaveEaster) {
             return;
             }

            // Nếu mã đã tồn tại, cập nhật lại mã
            if (existingCodeIndex !== -1) {
                codeNumbers[existingCodeIndex].code = code;
            } else {
                // Nếu mã không tồn tại, thêm mới vào codeNumbers
                codeNumbers.push({
                    date: date,
                    code: code
                });
            }
        }
    });
}


// Hàm để cập nhật mã codeNumbers cho nhiều ngày, bất kể có là Chủ Nhật hay không
function updateCodeNumbersIncludingSundays(year, codePrefix, codeNumbers) {
    // Mảng các ngày cần cập nhật, bao gồm cả ngày Chủ Nhật
    const datesToUpdate = [
        '08-15', '11-01', '11-02',
        '06-29', '06-24', '02-02','09-14'
    ];

    datesToUpdate.forEach(dateString => {
        // Tách ngày và tháng từ chuỗi dateString
        let [month, day] = dateString.split('-');
        // Tạo đối tượng Date với year, month và day
        let date = new Date(year, parseInt(month) - 1, parseInt(day)); // Tháng trong Date là 0-based nên cần trừ 1

        let code = `7${day}${month}`;

        // Tìm kiếm mã đã tồn tại
        let existingCodeIndex = codeNumbers.findIndex(item => item.date.getTime() === date.getTime());

        // Nếu mã đã tồn tại, cập nhật lại mã
        if (existingCodeIndex !== -1) {
            codeNumbers[existingCodeIndex].code = code;
        } else {
            // Nếu mã không tồn tại, thêm mới vào codeNumbers
            codeNumbers.push({
                date: date,
                code: code
            });
        }
    });
}


    function calculatenumberSunday(year) {
        const baptismOfTheLord = global.getBaptismOfTheLord(year);
        const ashWednesday = global.getAshWednesday(global.getEasterDate(year));
        const easterDate = global.getEasterDate(year);
        const pentecost = global.getPentecost(easterDate);
        const firstSundayOfAdvent = global.getFirstSundayOfAdvent(year);
        const epiphanySunday = global.getEpiphanySunday(year);
    	global.getChristTheKing = getChristTheKing;

        let sundayNumbers = [];
        let codeNumbers = [];
        let lastOrdinaryWeekBeforeLent = 0;

        let currentDate = new Date(year, 0, 1); // Tháng 0 là tháng 1

        // Push tất cả các ngày từ 1/1 đến trước lễ Hiển Linh vào mảng codeNumbers
        while (currentDate < epiphanySunday) {
            let day = currentDate.getDate();
            let month = currentDate.getMonth() + 1; // Lấy tháng chính xác
            let code = `20${day}0${month}`;
        
            codeNumbers.push({
                date: new Date(currentDate), // Tạo một bản sao của ngày
                code: code
            });
        
            currentDate.setDate(currentDate.getDate() + 1);
        }
        

        // Tiếp tục các xử lý khác trong năm
        let currentDate1 = new Date(epiphanySunday); 
        let abc = new Date(baptismOfTheLord); 

        if (baptismOfTheLord.getDay() === 0) {
            if (epiphanySunday < abc) {
                let result = processLiturgicalWeeks(currentDate1, baptismOfTheLord, '60', 0, 1, codeNumbers, sundayNumbers);
                currentDate1 = result.currentDate; 
            }
        } else {
            codeNumbers.push({
                date: new Date(epiphanySunday),
                code: "6000"
            });
        }

        currentDate = new Date(baptismOfTheLord);

        if (currentDate.getDay() !== 0) {
            currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay()));
        }

        let sundayNumber = baptismOfTheLord.getDay() === 0 ? 1 : 2;

        // Nếu sundayNumber là 2, xử lý 6 ngày trước đó
        if (sundayNumber === 2) {
            for (let i = 6; i >= 1; i--) {
                currentDate.setDate(currentDate.getDate() - 1);
                let dayCode = i === 1 ? 0 : i;
                codeNumbers.push({
                    date: new Date(currentDate),
                    code: `50${1}${dayCode}`
                });
            }
            currentDate.setDate(currentDate.getDate() + 6);
        }

        let result = processLiturgicalWeeks(currentDate, ashWednesday, '50', sundayNumber, lastOrdinaryWeekBeforeLent, codeNumbers, sundayNumbers);
        sundayNumber = result.sundayNumber;
        lastOrdinaryWeekBeforeLent = result.weekBeforeLent;
        currentDate = result.currentDate;

        // Tính Mùa Chay và Mùa Phục Sinh
        currentDate = new Date(ashWednesday);
        currentDate.setDate(ashWednesday.getDate() + (7 - ashWednesday.getDay()));
        result = processLiturgicalWeeks(currentDate, easterDate, '30', 1, lastOrdinaryWeekBeforeLent, codeNumbers, sundayNumbers);
        sundayNumber = result.sundayNumber;
        currentDate = result.currentDate;

        currentDate = new Date(easterDate);
        result = processLiturgicalWeeks(currentDate, pentecost, '40', 1, lastOrdinaryWeekBeforeLent, codeNumbers, sundayNumbers);
        currentDate = result.currentDate;

        // Tính tuần Thường Niên sau Lễ Hiện Xuống
        let ordinaryAfterPentecostWeek = baptismOfTheLord.getDay() !== 0 ? lastOrdinaryWeekBeforeLent + 1 : lastOrdinaryWeekBeforeLent + 2;

        currentDate = new Date(pentecost);
        currentDate.setDate(pentecost.getDate());
        let ordinaryEndDate = new Date(firstSundayOfAdvent);
        result = processLiturgicalWeeks(currentDate, firstSundayOfAdvent, '50', ordinaryAfterPentecostWeek, lastOrdinaryWeekBeforeLent, codeNumbers, sundayNumbers, true);
        currentDate = result.currentDate;

        let adventEndDate = new Date(`${year}-12-31`);
        currentDate = new Date(firstSundayOfAdvent);
        result = processLiturgicalWeeks(currentDate, adventEndDate, '10', 1, lastOrdinaryWeekBeforeLent, codeNumbers, sundayNumbers);
        currentDate = result.currentDate;

        // Xử lý ngày từ 17/12 đến 31/12
        let startDate = new Date(`${year}-12-17`);
        let endDate = new Date(`${year}-12-31`);
        currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            let day = currentDate.getDate();
            let month = currentDate.getMonth() + 1; // Lấy tháng
            let code = `2${day}${month < 10 ? '0' : ''}${month}`; // Định dạng mã số: "2" + day + month

            // Kiểm tra các điều kiện đặc biệt
            if (currentDate.getDay() === 0 && currentDate >= new Date(`${year}-12-17`) && currentDate <= new Date(`${year}-12-24`)) {
                let a = currentDate.getTime() === new Date(`${year}-12-17`).getTime() ? 2 : 1;
                if (a === 1 && currentDate.getDay() === 0) {
                    code = "1040";
                } else if (a === 2 && currentDate.getDay() === 0) {
                    if (currentDate.getTime() === new Date(`${year}-12-17`).getTime()) {
                        code = "1030";
                    }
                    if (currentDate.getTime() === new Date(`${year}-12-24`).getTime()) {
                        code = "1040";
                    }
                }
            }

            if (currentDate.getTime() === new Date(`${year}-12-30`).getTime() && new Date(`${year}-12-25`).getDay() === 0) {
                code = "2010";
            }
            if (currentDate.getDay() === 0 && currentDate >= new Date(`${year}-12-26`) && currentDate <= new Date(`${year}-12-31`)) {
                code = "2010";
            }

            // Tìm kiếm mã đã tồn tại
            let existingCodeIndex = codeNumbers.findIndex(item => item.date.getDate() === currentDate.getDate() && item.date.getMonth() === currentDate.getMonth());

            // Nếu mã đã tồn tại, cập nhật lại mã
            if (existingCodeIndex !== -1) {
                codeNumbers[existingCodeIndex].code = code;
            } else {
                codeNumbers.push({
                    date: new Date(currentDate),
                    code: code
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Gọi hàm để cập nhật các ngày
        updateCodeNumbersForMultipleDates(year, "20", codeNumbers);

	// Gọi hàm để cập nhật các ngày, bao gồm cả ngày Chủ Nhật
	updateCodeNumbersIncludingSundays(year, "20", codeNumbers);


	//Các ngày lễ đặc biệt bị chuyển dời hoặc không theo ngày tháng

Trinity = new Date(easterDate);
Trinity.setDate(easterDate.getDate() + 56);
Corpus = new Date(easterDate);
Corpus.setDate(easterDate.getDate() + 63);
Heartjesus = new Date(easterDate);
Heartjesus.setDate(easterDate.getDate() + 68);

let existingpentecostIndex = codeNumbers.findIndex(item => item.date.getTime() === pentecost.getTime());
let existingTrinityIndex = codeNumbers.findIndex(item => item.date.getTime() === Trinity.getTime());
let existingCorpusIndex = codeNumbers.findIndex(item => item.date.getTime() === Corpus.getTime());
let existingHeartjesusIndex = codeNumbers.findIndex(item => item.date.getTime() === Heartjesus.getTime());
// kiểm tra ngày 6/8 cập nhật lại mã
let aug8 = new Date(year, 7, 6); // Tháng 12 là tháng thứ 11 (0-based)
let existingaug8Index = codeNumbers.findIndex(item => item.date.getTime() === aug8.getTime());
if (existingaug8Index !== -1) {
    codeNumbers[existingaug8Index].code = `5450`;
}


if (existingpentecostIndex !== -1) {
    codeNumbers[existingpentecostIndex].code = `5410`;
}
if (existingTrinityIndex !== -1) {
    codeNumbers[existingTrinityIndex].code = `5420`;
}
if (existingCorpusIndex !== -1) {
    codeNumbers[existingCorpusIndex].code = `5430`;
}
if (existingHeartjesusIndex !== -1) {
    codeNumbers[existingHeartjesusIndex].code = `5440`;
}

// 0. Kiểm tra ngày Thánh Tâm (Heartjesus) có trùng ngày 24/6 không
let Jun24 = new Date(year, 5, 24);  // Ngày 24 tháng 6
let Jun23 = new Date(year, 5, 23);  // Ngày 23 tháng 6

// Sửa lại câu lệnh kiểm tra đúng
if (Jun24.getTime() === Heartjesus.getTime()) { // So sánh chính xác ngày tháng
    // Nếu ngày trùng khớp, cập nhật mã cho ngày 23/6
    let existingJun23Index = codeNumbers.findIndex(item => item.date.getTime() === Jun23.getTime());
    if (existingJun23Index !== -1) {
        codeNumbers[existingJun23Index].code = `72406`;
    } else {
        codeNumbers.push({
            date: Jun23,
            code: `72406`
        });
    }
} else {
    // Nếu không phải ngày 24/6, cập nhật mã cho ngày 24/6
    let existingJun24Index = codeNumbers.findIndex(item => item.date.getTime() === Jun24.getTime());
    if (existingJun24Index !== -1) {
        codeNumbers[existingJun24Index].code = `72406`;
    } else {
        codeNumbers.push({
            date: Jun24,
            code: `72406`
        });
    }
}



// 1. Kiểm tra nếu ngày 19/3 là Chủ Nhật (vì Mùa Chay)
let march19 = new Date(year, 2, 19); // Tháng 3 là tháng thứ 2 (0-based)
let march20 = new Date(year, 2, 20);

if (march19.getDay() === 0) {
    // Nếu là Chủ Nhật, cập nhật mã cho ngày là 71903
    let existingMarch20Index = codeNumbers.findIndex(item => item.date.getTime() === march20.getTime());
    if (existingMarch20Index !== -1) {
        codeNumbers[existingMarch20Index].code = `71903`;
    } else {
        codeNumbers.push({
            date: march20,
            code: `71903`
        });
    }
} else {
    // Nếu không phải Chủ Nhật, cập nhật mã cho ngày 19/3
    let existingMarch19Index = codeNumbers.findIndex(item => item.date.getTime() === march19.getTime());
    if (existingMarch19Index !== -1) {
        codeNumbers[existingMarch19Index].code = `71903`;
    } else {
        codeNumbers.push({
            date: march19,
            code: `71903`
        });
    }
}



// 2. Kiểm tra nếu ngày 8/12 là Chủ Nhật ( vì Mùa Vọng)
let dec8 = new Date(year, 11, 8); // Tháng 12 là tháng thứ 11 (0-based)
let dec9 = new Date(year, 11, 9);

if (dec8.getDay() === 0) {
    // Nếu 8/12 là Chủ Nhật, cập nhật mã cho ngày 9/12 là 70812
    let existingDec9Index = codeNumbers.findIndex(item => item.date.getTime() === dec9.getTime());
    if (existingDec9Index !== -1) {
        codeNumbers[existingDec9Index].code = `70812`; // Cập nhật mã cho ngày 9/12
    } else {
        codeNumbers.push({
            date: dec9,
            code: `70812`
        });
    }
} else {
    // Nếu không phải Chủ Nhật, cập nhật mã cho ngày 8/12
    let existingDec8Index = codeNumbers.findIndex(item => item.date.getTime() === dec8.getTime());
    if (existingDec8Index !== -1) {
        codeNumbers[existingDec8Index].code = `70812`; // Cập nhật mã cho ngày 8/12
    } else {
        codeNumbers.push({
            date: dec8,
            code: `70812`
        });
    }
}


// 3. Kiểm tra nếu ngày 25/3 nằm trong khoảng -8 ngày đến ngày Phục Sinh (vì tuần thánh)
let march25 = new Date(year, 2, 25); // Tháng 3 là tháng thứ 2 (0-based)
let eightDaysBeforeEaster = new Date(easterDate);
eightDaysBeforeEaster.setDate(easterDate.getDate() - 8);
let eightDaysAfterEaster = new Date(easterDate);
eightDaysAfterEaster.setDate(easterDate.getDate() + 8);

if (march25 >= eightDaysBeforeEaster && march25 <= easterDate) {
    // Nếu ngày 25/3 nằm trong khoảng -8 ngày trước lễ Phục Sinh, cập nhật mã cho +8 ngày sau lễ Phục Sinh
    let existingDateAfterEasterIndex = codeNumbers.findIndex(item => item.date.getTime() === eightDaysAfterEaster.getTime());
    if (existingDateAfterEasterIndex !== -1) {
        codeNumbers[existingDateAfterEasterIndex].code = `72503`; // Mã sau Phục Sinh
    } else {
        codeNumbers.push({
            date: new Date(eightDaysAfterEaster),
            code: `72503`
        });
    }
} else {
    // Nếu không nằm trong khoảng, cập nhật mã cho ngày 25/3
    let existingMarch25Index = codeNumbers.findIndex(item => item.date.getTime() === march25.getTime());
    if (existingMarch25Index !== -1) {
        codeNumbers[existingMarch25Index].code = `72503`;
    } else {
        codeNumbers.push({
            date: new Date(march25),
            code: `72503`
        });
    }
}
// 4.Kiểm tra nếu ngày 24/11 trùng với lễ Chúa Kitô Vua 
let november24 = new Date(year, 10, 24); // Tháng 11 là tháng 10 (0-based)
let christTheKing = global.getChristTheKing(year);

// Nếu 24/11 trùng với lễ Chúa Kitô Vua, cập nhật mã cho ngày hôm sau (thứ Hai)
if (november24.getTime() === christTheKing.getTime()) {
    let dayAfterChristTheKing = new Date(christTheKing);
    dayAfterChristTheKing.setDate(christTheKing.getDate() + 1);

    let existingIndex = codeNumbers.findIndex(item => item.date.getTime() === dayAfterChristTheKing.getTime());
    if (existingIndex !== -1) {
        codeNumbers[existingIndex].code = `72411`; // Mã cho ngày 25/11 (hoặc mã bạn mong muốn)
    } else {
        codeNumbers.push({
            date: dayAfterChristTheKing,
            code: `72411`
        });
    }
} else {
    // Nếu không trùng, cập nhật mã cho ngày 24/11
    let existingNovember24Index = codeNumbers.findIndex(item => item.date.getTime() === november24.getTime());
    if (existingNovember24Index !== -1) {
        codeNumbers[existingNovember24Index].code = `72411`;
    } else {
        codeNumbers.push({
            date: november24,
            code: `72411`
        });
    }
}

// Cập nhật mã cho các ngày từ -46 (Lễ Tro) đến -43 (4 ngày sau Lễ Tro)
for (let i = 0; i < 4; i++) {
    let currentDay = new Date(ashWednesday);
    currentDay.setDate(ashWednesday.getDate() + i); // Lần lượt từ -46 đến -43

    let code = `300${i + 4}`; // Các mã 3003, 3004, 3005, 3006

    // Kiểm tra và cập nhật mã
    let existingDayIndex = codeNumbers.findIndex(item => item.date.getTime() === currentDay.getTime());
    if (existingDayIndex !== -1) {
        codeNumbers[existingDayIndex].code = code;
    } else {
        codeNumbers.push({
            date: new Date(currentDay),
            code: code
        });
    }
}       

// Thêm các ngày lễ âm lịch vào code

// Mồng 1 Tết
const lunarNewYearArray = getSolarDate(1, 1, year); // Lấy mảng trả về (ngày, tháng)
const lunarNewYear = new Date(year, lunarNewYearArray[1] - 1, lunarNewYearArray[0]); // Sử dụng ngày và tháng từ mảng, thêm năm

let existingLunarNewYearIndex = codeNumbers.findIndex(item => item.date.getTime() === lunarNewYear.getTime());
if (existingLunarNewYearIndex !== -1) {
    codeNumbers[existingLunarNewYearIndex].code = `70001`; // Mã cho Mồng 1
}

// Mồng 2 Tết
const secondLunarDay = new Date(lunarNewYear);
secondLunarDay.setDate(lunarNewYear.getDate() + 1); // Tính ngày Mồng 2

let existingSecondLunarDayIndex = codeNumbers.findIndex(item => item.date.getTime() === secondLunarDay.getTime());
if (existingSecondLunarDayIndex !== -1) {
    codeNumbers[existingSecondLunarDayIndex].code = `70002`; // Mã cho Mồng 2
}

// Mồng 3 Tết
const thirdLunarDay = new Date(lunarNewYear);
thirdLunarDay.setDate(lunarNewYear.getDate() + 2); // Tính ngày Mồng 3

let existingThirdLunarDayIndex = codeNumbers.findIndex(item => item.date.getTime() === thirdLunarDay.getTime());
if (existingThirdLunarDayIndex !== -1) {
    codeNumbers[existingThirdLunarDayIndex].code = `70003`; // Mã cho Mồng 3
}


// Trả về đối tượng chứa sundayNumbers và các hàm get
    return {
        getSundayNumberForDay: function (solarDate) {
            for (let sunday of sundayNumbers) {
                if (solarDate.getTime() === sunday.date.getTime()) {
                    return sunday.weekNumber;
                }
            }
            return ''; // Nếu không tìm thấy, trả về chuỗi rỗng
        },
        getCodeNumberForDay: function (solarDate) {
            for (let day of codeNumbers) {
                if (solarDate.getTime() === day.date.getTime()) {
                    return day.code;
                }
            }
            return ''; // Nếu không tìm thấy, trả về chuỗi rỗng
        },
        sundayNumbers // Trả về cả mảng sundayNumbers để kiểm tra
    };
}


    global.calculatenumberSunday = calculatenumberSunday;

})(window || globalThis);
