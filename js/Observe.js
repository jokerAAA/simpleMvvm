class Observe {
    constructor(data) {
        this.data = data;
        this.init()
    }
    init() {
        const dep = new Dep();
        const data = this.data;
        for (let key in data) {
            let val = data[key];
            observe(val);
            Object.defineProperty(data, key, {
                enumerable: true,
                get() {
                    // 进行依赖收集，这里用了取巧的办法
                    Dep.target && dep.addSub(Dep.target);
                    // console.log('get', val);
                    return val;
                },
                set(newVal) {
                    if (newVal === val) {
                        return false;
                    }
                    val = newVal;
                    // 如果被设置为新对象,需要从头observe
                    observe(val);
                    // 通知订阅,TODO: 这里要多次触发~
                    dep.notify();
                }
            })
        }
    }
}

function observe(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }
    return new Observe(data);
}