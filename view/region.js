class AudioRegion {
    bpm=90;
    key=KEY.A + MINOR;

    constructor(node, length, name) {
        this.node = node;
        this.original_node = node;
        this.name = name;
        this.length = length;
    }
}