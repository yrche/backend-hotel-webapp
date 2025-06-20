module.exports = class RoomDto {
    id;
    roomType;
    description;
    pricePerNight;
    capacity;

    constructor(model) {
        this.id = model.id;
        this.roomType = model.roomType;
        this.description = model.description;
        this.pricePerNight = model.pricePerNight;
        this.capacity = model.capacity;
    }
}