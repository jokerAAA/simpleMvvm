class Compile {
    constructor(el, vm) {
        vm.$el = document.querySelector(el);
        let child = null;
        // 创造一个documentFragment
        // 通过该方法创造的dom片段位于内存中，插入dom中不会引起回流，性能更好
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createDocumentFragment
        const fragment = document.createDocumentFragment();
        while(child = vm.$el.firstChild) {
            fragment.appendChild(child)
        }

        replace(fragment, vm);

        vm.$el.appendChild(fragment);
    }
}

function replace(fragment, vm) {
    Array.from(fragment.childNodes).forEach(node => {
        /**
         * 对文本节点中的插值表达式可以分为以下3步
         * 1. 捕获插值表达式,取得插值表达式中的exp
         * 2. 将插值表达式中的exp替换为data中exp对应的值,修改对应node节点
         * 3. 添加watcher订阅,当data的exp对应的值发生变化时,更新对应node节点
         */
        let reg = /\{\{(.*)\}\}/;
        let text = node.textContent;
        // 判断文本节点，是否含有{{}}
        if (node.nodeType === 3 && reg.test(text)) {
            // 捕获{{}}中的内容
            const exp = RegExp.$1;
            
            // 处理a.b.x的场景
            const arr = exp.split('.'); // ['a', 'b', 'x'];
            let val = vm;
            arr.forEach(v => {
                val = val[v] 
            })

            // 替换变量的值
            node.textContent = text.replace(reg, val);

            // 这里添加订阅函数
            new Watcher(vm, exp, (newVal) => {
                node.textContent = text.replace(reg, newVal);
            })
        }

        if (node.childNodes) {
            replace(node, vm)
        }
    })
}