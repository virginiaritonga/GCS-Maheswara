var methods = {};

methods = {
    calculate_compass_bearing: function(target_latitude, target_longitude, origin_latitude, origin_longitude){
        let diff_longitude = degrees_to_radians(target_longitude - origin_longitude);
        let x = Math.sin(diff_longitude) * Math.cos(degrees_to_radians(target_latitude));
        let y = Math.cos(degrees_to_radians(origin_latitude)) * Math.sin(degrees_to_radians(target_latitude)) - (Math.sin(degrees_to_radians(origin_latitude)) * Math.cos(degrees_to_radians(target_latitude))*Math.cos(diff_longitude))
        let bearing = Math.atan2(x, y)
        bearing = radians_to_degrees(bearing)
        let compass_bearing = (bearing+360) % 360
        return compass_bearing
    },
    calculate_distance: function(target_latitude, target_longitude, origin_latitude, origin_longitude){
        let earth_radius = 6373000
        let diff_latitude = degrees_to_radians(target_latitude - origin_latitude)
        let diff_longitude = degrees_to_radians(target_longitude - origin_longitude)
        let a = Math.sin(diff_latitude/2) * Math.sin(diff_latitude/2) + Math.cos(degrees_to_radians(origin_latitude)) * Math.cos(degrees_to_radians(target_latitude)) * Math.sin(diff_longitude/2) * Math.sin(diff_longitude/2)
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        let distance = earth_radius * c
        return distance
    },
    calculate_vertical_angle: function(distance, height){
        let radians = Math.atan2(height, distance)
        let angle = radians * (180 / Math.PI)
        return angle
    }};
function degrees_to_radians(degrees){
    var pi = Math.PI;
    return degrees * (pi/180);
}
function radians_to_degrees(radians){
    var pi = Math.PI;
    return radians * (180/pi);
}
exports.data = methods;
// console.log(calculate_compass_bearing(100,45,10,0));
// console.log(calculate_distance(7.112412,-1.3213,7,-1))
// console.log(calculate_vertical_angle(100,100))