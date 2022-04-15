// https://dmitripavlutin.com/javascript-queue/
export class Queue<T> {
    private items: {[index: number]: T} = {};
    private headIndex: number = 0;
    private tailIndex: number = 0;
    constructor(...items: T[]) {
        items.forEach((item) => this.enqueue(item));
    }
    enqueue(item: T) {
        this.items[this.tailIndex] = item;
        this.tailIndex++;
    }
    dequeue() {
        const item = this.items[this.headIndex];
        delete this.items[this.headIndex];
        this.headIndex++;
        return item;
    }
    peek() {
        return this.items[this.headIndex];
    }
    get length() {
        return this.tailIndex - this.headIndex;
    }
    isEmpty() {
        return this.length === 0;
    }
}