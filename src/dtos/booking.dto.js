module.exports = class BookingDto {
    id;
    user;
    room;
    checkInDate;
    checkOutDate;
    totalPrice;

    constructor(model) {
        this.id = model.id;
        this.user = model.user;
        this.room = model.room;
        this.checkInDate = model.checkInDate;
        this.checkOutDate = model.checkOutDate;
        this.totalPrice = model.totalPrice;
    }
}