
let index = 0;

class Dep {
    constructor() {
        this.subs = []
    }

    addSub(sub) {
        console.log('sub', sub);
        this.subs.push(sub);
    }

    notify() {
        console.log(this.subs);
        this.subs.forEach(sub => {
            sub && sub.update();
        })
    }
}

Dep.target = null;

class Watcher {

    constructor(vm, exp, cb) {
        this.cb = cb;
        this.vm = vm;
        this.exp = exp;
        this.init()
    }

    init() {
        // 这里用Dep.target存放watcher实例，在watcher实例的cb中存的是真的回调方法
        Dep.target = this;
        console.log(Dep.target)
        // 这里每个watcher都有data对应的exp的值，这里通过对值的访问触发getter函数，
        // 在getter函数中对watcher进行收集

        /**
         * 所以依赖收集的完成路径是：
         * 1. 在模板编译阶段,捕获插值表达式，对每个插值表达式的exp创建watcher,添加值变更回调，即更新dom
         * 2. new watcher阶段时会触发对data[exp]的访问，从而触发data[exp]的getter函数
         * 3. 在getter函数中进行依赖收集，将每个watcher添加到dep的依赖收集中
         * 总结： 模板编译 => new Watcher => data[exp]的getter => dep.addDep
         * 
         * 当data[exp]发生变更时
         * 1. 触发data[exp]的setter函数， 在setter函数中触发dep.notify
         * 2. dep.notify中进行watcher的update操作
         * 3. 在update中先取新的data[exp]的值，执行变更回调，并传递新值
         * 总结： data[exp]的setter => dep.notify => watcher.update() => db(newVal)
         */
        let val = this.vm;
        const arr = this.exp.split('.');
        arr.forEach(v => {
            val = val[v]
        });
        Dep.target = null;
    }

    update() {
        let newVal = this.vm;
        const arr = this.exp.split('.');
        arr.forEach(v => {
            newVal = newVal[v]
        });
        console.log(newVal);
        console.log(++index);
        this.cb(newVal);
    }
}