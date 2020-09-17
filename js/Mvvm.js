
class MVVM {
    constructor(options) {
        // 1. 参数处理
        this.$options = options;
        let data = this._data = options.data;
        // 2. data观察
        observe(data);
        // 3. 设置代理： this.data.x => this.x;
        for (let key in data) {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return this._data[key];
                },
                set(newVal) {
                    this._data[key] = newVal
                }
            })
        }
        // 4. 编译模板
        this.compile();
    }

    compile() {
        const options = this.$options;
        new Compile(options.el, this);
    }

}