/**
 * The ship
 * @param {number} size        size of the ship
 * @param {string} orientation orientation of the ship on game board
 * @param {object} location    location of the boat
 * @constructor
 */
module.exports = function(size, orientation, location) {
    this.size = size;
    this.orientation = orientation;
    this.location = location;
    this.life = size;
}
