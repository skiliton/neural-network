/**
 * Created by skili on 07.05.2017.
 */
function Food(WorldArea) {
    if (!(WorldArea instanceof Rectangle)) {
        throw new Error("WorldArea must be instanceof Rectangle")
    }
    this.position = createRandomPoint(WorldArea);
}