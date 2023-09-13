// 1. Напишите функцию deepEqual для проверки двух обьектов на идентичность.
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

console.log(deepEqual({ name: "test" }, { name: "test" })); // output true
console.log(deepEqual({ name: "test" }, { name: "test1" })); // output false
console.log(
  deepEqual(
    { name: "test", data: { value: 1 } },
    { name: "test", data: { value: 2 } }
  )
); // output false
console.log(deepEqual({ name: "test" }, { name: "test", age: 10 })); // false

//2. Напишите функцию генератор chunkArray, которая возвращает итератор возвращающий части массива указанной длинны.
function chunkArray(arr, chunkSize) {
  let index = 0;

  return {
    next() {
      if (index >= arr.length) {
        return { value: undefined, done: true };
      }
      const chunk = arr.slice(index, index + chunkSize);
      index += chunkSize;
      return { value: chunk, done: false };
    },
  };
}

const iterator = chunkArray([1, 2, 3, 4, 5, 6, 7, 8], 3);
console.log(iterator.next()); // { value: [1,2,3], done: false }
console.log(iterator.next()); // { value: [4,5,6], done: false }
console.log(iterator.next()); // { value: [7,8], done: false }
console.log(iterator.next()); // { value: undefined, done: true }

// 3. Напишите функцию обертку, которая на вход принимает массив функций и их параметров,
// а возвращает массив результатов их выполнения. Количество аргументов исполняемой функции не ограничено!

function bulkRun(functionsAndArgs) {
  const results = [];
  function runFunction(fn, args) {
    return new Promise((resolve) => {
      fn(...args, (result) => {
        results.push(result);
        resolve();
      });
    });
  }
  const promises = functionsAndArgs.map(([fn, args]) => runFunction(fn, args));
  return Promise.all(promises).then(() => results);
}

const f1 = (cb) => {
  cb(1);
};
const f2 = (a, cb) => {
  cb(a);
};
const f3 = (a, b, cb) => {
  setTimeout(() => cb([a, b]), 1000);
};

bulkRun([
  [f1, []],
  [f2, [2]],
  [f3, [3, 4]],
])
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
// Output: [1, 2, [3, 4]]

// 4. Напишите метод arrayToObject, который превращает массив в объект (использовать рекурсию).
function arrayToObject(arr) {
  const result = {};
  for (const item of arr) {
    const [key, value] = item;
    if (Array.isArray(value)) {
      result[key] = arrayToObject(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

const arr = [
  ["name", "developer"],
  ["age", 5],
  [
    "skills",
    [
      ["html", 4],
      ["css", 5],
      ["js", 5],
    ],
  ],
];

console.log(arrayToObject(arr));

// 5. Написать обратный метод (см. задачу 4) objectToArray, который из объекта создаст массив.
function objectToArray(obj) {
  const result = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === "object" && !Array.isArray(value)) {
        result.push([key, objectToArray(value)]);
      } else {
        result.push([key, value]);
      }
    }
  }

  return result;
}

console.log(
  objectToArray({
    name: "developer",
    age: 5,
    skills: {
      html: 4,
      css: 5,
      js: 5,
    },
  })
);

// 6. Есть функция primitiveMultiply, которая умножает числа, но случайным образом может выбрасывать исключения
// типа: NotificationException, ErrorException. Задача написать функцию обертку которая будет повторять
// вычисление при исключении NotificationException, но прекращать работу при исключениях ErrorException.

function NotificationException() {}
function ErrorException() {}

function primitiveMultiply(a, b) {
  const rand = Math.random();
  if (rand < 0.5) {
    return a * b;
  } else if (rand > 0.85) {
    throw new ErrorException();
  } else {
    throw new NotificationException();
  }
}

function reliableMultiply(a, b) {
  while (true) {
    try {
      return primitiveMultiply(a, b);
    } catch (error) {
      if (error instanceof NotificationException) {
        console.log(
          "Помилка типу NotificationException. Повторюємо обчислення."
        );
        continue;
      } else if (error instanceof ErrorException) {
        console.log("Помилка типу ErrorException. Завершуємо роботу.");
        break;
      } else {
        throw error;
      }
    }
  }
}
console.log(reliableMultiply(8, 8));

// 7. Напишите функцию, которая берет объект любой вложенности и преобразует ее в единую плоскую карту с разными уровнями, разделенными косой чертой ( '/').

function mapObject(obj, parentKey = "") {
  let result = {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const nestedKeys = mapObject(obj[key], parentKey + key + "/");
      result = { ...result, ...nestedKeys };
    } else {
      result[parentKey + key] = obj[key];
    }
  }
  return result;
}

const obj = {
  a: {
    b: {
      c: 12,
      d: "Hello World",
    },
    e: [1, 2, 3],
  },
};

const flatObj = mapObject(obj);
console.log(flatObj);

// 8. Напишите функцию combos, которая принимает положительное целое число num и возвращает массив массивов положительных целых чисел, где сумма каждого массива равна  num.  Массивы не должны повторяться.

function combos(num) {
  function backtrack(remaining, currentCombo, start) {
    if (remaining === 0) {
      result.push([...currentCombo]);
      return;
    }
    if (remaining < 0) {
      return;
    }
    for (let i = start; i < num; i++) {
      currentCombo.push(i + 1);
      backtrack(remaining - (i + 1), currentCombo, i);
      currentCombo.pop();
    }
  }
  const result = [];
  backtrack(num, [], 0);
  return result;
}

console.log(combos(3));
console.log(combos(10));

// 9. Напишите функцию add, которая бы работала следующим образом add(1)(2)(7)...(n). Количество последовательных визовов неограничено.

function add(x) {
  function innerAdd(y) {
    x += y;
    return innerAdd;
  }
  innerAdd.valueOf = function () {
    return x;
  };
  return innerAdd;
}

console.log(Number(add(1)(2)));
console.log(Number(add(1)(2)(5)));
console.log(Number(add(1)(2)(-3)(4)));
console.log(Number(add(1)(2)(3)(4)(-5)));
