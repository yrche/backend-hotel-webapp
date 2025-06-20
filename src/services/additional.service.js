class AdditionalService {
    async calculateNumberOfNights(checkInDate, checkOutDate) {
        const checkIn = checkInDate.split('-').map((e) => {
            return Number(e);
        })

        const checkOut = checkOutDate.split('-').map((e) => {
            return Number(e);
        })

        let quantityOfDays = 0;
        let quantityOfYears = 0;
        let quantityOfMonth = 0;
        let years = 0;
        let month = 0;

        for (let i = 0; i < 3; i++) {
            if (i === 0) {
                if (checkIn[i] !== checkOut[i]) {
                    quantityOfYears = checkOut[i] - checkIn[i];
                }
            }
            if (i === 1) {
                if (checkIn[i] !== checkOut[i]) {
                    quantityOfMonth = checkOut[i] - checkIn[i];
                }
            }
            if (i === 2) {
                if (checkIn[i] !== checkOut[i]) {
                    quantityOfDays = checkOut[i] - checkIn[i];
                }
            }
        }

        const daysInMonth = (month, year) => {
            return new Date(year, month, 0).getDate();
        }

        const daysInYear = (year) => {
            return ((year % 4 === 0 && year % 100 > 0) || year % 400 === 0) ? 366 : 365;
        }

        for (let i = 0; i < (quantityOfMonth); i++) {
            month += daysInMonth(checkIn[1]+i, checkIn[0])
        }

        for (let i = 0; i < (quantityOfYears); i++) {
            years += daysInYear(checkIn[0]+i)
        }

        return (years+quantityOfDays+month)
    }

    getCurrentDate() {
        return (new Date()).toISOString().slice(0, 10);
    }
}

module.exports = new AdditionalService();