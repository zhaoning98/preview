/**
 * Created by zhao.ning on 2017-03-30.
 */
export var firstName = '赵';
export var lastName = '宁';
export var year = 1993;

//=====>
/*
 var firstName = '赵';
 var lastName = '宁';
 var year = 1993;

 export {firstName, lastName, year};
 //它与前一种写法是等价的，但是应该优先考虑使用这种写法。
*/


// export命令除了输出变量，还可以输出函数或类( class )
export function  multiply(x, y) {
    return x * y;
};
//上面代码对外输出一个函数 multiply

//通常情况下，export 输出的变量就是本来的名字，但是可以使用 as 关键字重命名
function v1() {  }
function v2() {  }

export {
    v1 as streamV1,
    v2 as streamV2,
    v2 as streamLatestVersion
};

// 上面代码使用 as 关键字，重命名了函数 v1 和 v2 的对外接口。重命名后，v2 可以用不同的名字输出两次。

// 需要特别注意的是，export 命令规定的是对外的接口，必须与模板内部的变量建立一一对应关系。
// 写法一
export var m = 1;
// 写法二
var m = 1;
export {m};
// 写法三
var n = 1;
export {n as m};

// 上面三种写法都是正确的，规定了对外的接口 m 。
// 其他脚本可以通过这个接口，取到值 1 。

// 同样的，function 和 class 的输出，也必须遵守这样的写法。
export function f() { };

function f() {}
export {f};

// 另外，export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);
// 上面代码输出变量 foo ，值为 bar ，500毫秒之后变成 baz .

// 最后，export 命令可以出现在模块的任何位置，只要处于模块顶层就可以。
// 如果处于块级作用域内，就会报错，import 命令也是如此。
// 这是因为处于条件代码块之中，就没法做静态优化了，违背了ES6 模块的设计初衷。

function foo() {
    export default 'bar' // SyntaxError
}
foo()

// 上面代码中，export 语句放在函数之中，结果报错。

// 4、import 命令
// 使用 export 命令定义了模块的对外接口以后，其他 JS 文件就可以通过 import 命令加载这个模块。
//main.js
import {firstName, lastName, year} from '.profile';

function setName(element) {
    element.textContent = firstName + ' ' + lastName;
}
// 上面代码的 import 命令，用于加载 profile.js 文件，并从中输入变量。
// import 命令接受一对大括号，里面指定要从其他模块导入的变量名。
// 大括号里面的变量名，必须与被导入模块( profile.js )对外接口的名称相同。

// 如果想为输入的变量重新取一个名称，import命令要使用 as 关键字，将输入的变啦重命名。
import { lastName as surname } from './profile';

// import 后面的 from 指定模块文件的位置，可以是相对路径，也可以是绝对路径， .js 路径可以省略。
// 如果只是模块名，不带有路径，那么必须有配置文件，告诉 JavaScript 尽情该模块的位置。
import {myMethod} from 'util';
// 上面代码中， util 是模块文件名，由于不带有路径，必须通过配置，告诉引擎怎么取到这个模块。

// 注意，import命令具有提升效果，会提升到整个模块的头部，首先执行。
foo();
import { foo } from 'my_module';

// 上面的代码不会报错，因为 import 的执行早于 foo 的调用。
// 这种行为的本质是，import 命令是编译阶段执行的，在代码运行之前。

// 由于 import 是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

// import 语句会执行所加载的模块，因此可以有下面的写法。
import 'loadash';
//上面代码仅仅执行 loadsh 模块，但是不输入任何值。

// 如果多次重复执行同一句 import 语句，那么只会执行一次，而不会执行多次。

import { foo } from 'my_module';
import { foo } from 'my_module';
// =====>>>>>
import { foo, bar }  from 'my_module';
// 上面代码中，虽然 foo 和 bar 在两个语句中加载，但是他们对应的是同一个 my_module 实例。
// 也就是说，import 语句是 Singleton 模式

// 5、模块的整体加载
// 除了制定加载某个输出值，还可以使用整体加载，即用 ( * )指定一个对象，所有输出值都加载在这个对象上面。

// circle.js
export function area(radius) {
	return Math.PI * radius * radius;
}

export function circumference(radius) {
	return 2 * Math.PI * radius;
}
// 现在加载这个模块。
// main.js
import { area, circumference } from './circle';

console.log('圆面积：' + area(4));
console.log('圆周长：' + circumference(14));
// 上面写法是逐一指定要加载的方法，整体加载的写法如下。
import * as circle from './circle';

console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
// 逐一，模块整体加载所在的那个对象(上例是circle)，应该是可以静态分析的，所以不允许运行时改变。

// 6、export default 命令
// 从前面的例子可以看出，使用 import 命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。
// export default 命令，为模块指定默认输出。
// export-default.js
export default function () {
	console.log('foo');
}
// 上面代码是一个模块文件 export-default.js ，它的默认输出是一个函数。
// 其他模块加载该模块时，import 命令可以为该匿名函数指定任意名称。
// import-default.js
import customName from './export-default';
customName();
// 上面代码的 import 命令，可以用任意名称指向 export-default.js 输出的方法，这是就不需要知道元模块输出的函数名。
// 需要注意的是，这时 import 命令后面，不使用大括号。

// export default 命令用在非匿名函数前，也是可以的。
// export-default.js
export default function foo() {
	console.log('foo');
}
// 或者写成
function foo() {
	console.log('foo');
}
export default foo;
// 上面代码中，foo 函数的函数名 foo，在模块外部是无效的。加载的时候，视同匿名函数加载。

// export default 命令用于指定模块的默认输出。
// 显然，一个模块只能有一个默认输出，因此 export default 命令只能使用一次。
// 所以，import 命令后面才不用加大括号，因为只可能对应一个方法。

// 本质上，export default 就是输出一个叫做 default 的变量或方法，然后系统允许你为它取任意名字。

// 正是因为 export default 命令其实只是输出一个叫做 default 的变量，所以它后面不能跟变量声明语句

// 同样地，因为 export default 本质是将该命令后面的值，赋给 default 以后再默认，所以直接将一个值写在 export  default 之后

// 













