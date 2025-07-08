import {Rover} from "./rover";
import {Camera} from "./camera";

export class Photo {
    constructor(
        public id: number,
        public sol: number,
        public camera: Camera,
        public img_src: string,
        public earth_date: string,
        public rover: Rover
    ) {}

    static fromJson(json: any): Photo {
        return new Photo(
            json.id,
            json.sol,
            new Camera(
                json.camera.id,
                json.camera.name,
                json.camera.rover_id,
                json.camera.full_name
            ),
            json.img_src,
            json.earth_date,
            new Rover(
                json.rover.id,
                json.rover.name,
                json.rover.landing_date,
                json.rover.launch_date,
                json.rover.status
            )
        );
    }
}