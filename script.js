'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatDate = function (date, locale) {
  console.log(date);
  const compareDates = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = compareDates(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} Days ago`;
  else {
    // const day = date.getDate();
    // const month = date.getMonth() + 1;
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    console.log(locale);
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date, acc.locale);
    console.log(displayDate);

    const formatMovement = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
              <div class="movements__date">${displayDate}</div>

        <div class="movements__value">${formatMovement}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogTimer = function () {
  let time = 300;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }
    time = time - 1;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//experimenting

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      year: 'numeric',
      weekday: 'short',
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer = startLogTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      //add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2000);
  }
  inputLoanAmount.value = '';
  //reset timer
  clearInterval(timer);
  timer = startLogTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(12 === 12.0);
//base 10 - 0 to 9
//binary base 2 - 0 1
// console.log(0.1 + 0.2);
// console.log(+"23");
// console.log(+"23");

// //parsing
// console.log(Number.parseInt("30px", 10));
// console.log(Number.parseInt("30px", 10));
// console.log(Number.parseFloat("30.4px", 10));

// // console.log(parseFloat("2.5rem"));
// console.log(Number.isNaN(20));
// console.log(Number.isNaN(+"20X"));
// console.log(Number.isNaN(20 / 0));

// //checking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite("20"));
// console.log(Number.isFinite(+"20"));
// console.log(Number.isFinite(20 / 2));

// console.log(Number.isInteger(20));

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));
// console.log(Math.max(5, 18, 34, 100, 56, 88)); //does coersion but not parsing
// console.log(Math.min(3, 4, 6, 2, 1, 44));
// console.log(Math.PI * Number.parseFloat("10px") ** 2);
// console.log(Math.trunc(Math.random() * 6) + 1);
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(20, 40));

// //rounding int
// console.log(Math.trunc(22.2));
// console.log(Math.round(23.9));
// console.log(Math.ceil(23.9));
// console.log(Math.ceil(23.9));
// console.log(Math.floor(23.9));
// console.log(Math.floor("23.9"));

// //rounding decimals
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log(+(2.117).toFixed(2));

// console.log(5 % 2);
// console.log(5 / 2); // 5 = 2 * 2 +1

// console.log(8 % 3);
// console.log(8 / 3); // 8 = 3 * 3 +2

// const isEven = (n) => n % 2 === 0; //checking even by dividing 2
// console.log(isEven(7));
// console.log(isEven(4));

// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = "red";
//     if (i % 3 === 0) row.style.backgroundColor = "blue";
//   });
// });

//287,460,000,000
// const diameter = 287_460_000_000;
// console.log(diameter);

// const priceInCents = 432_99;

// const transferFee = 15_00;

// const transferFee2 = 1_500;

// const PI = 3.1415;

// console.log(Number("33000"));

// console.log(2 ** 53 - 1);
// console.log(2 ** 53 - 1);

// console.log(3248248932742894792382342431n);
// console.log(BigInt(324824893272431));

//operations with bigInt
// console.log(1000n + 1000n);
// console.log(100213123123123n + 102131239800n);

// const huge = 2138999999999221313123n;
// const number = 23;
// console.log(huge * BigInt(number));

// //exception
// console.log(20n > 15);
// console.log(20n === 20);
// console.log(huge + " is really big");

// //division
// console.log(10 / 3n); //returns closets bigInt 3.333333333333 =3

//create a date
// const noew = new Date();
// console.log(noew);

// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 18, 1, 23, 1));

// console.log(new Date(0));

// console.log(new Date(3 * 24 * 60 * 60 * 1000));

//working with dates
// const future = new Date(2037, 10, 18, 1, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getDate());
// console.log(future.getMonth());
// console.log(future.toISOString()); //usefull case
// console.log(future.getTime());
// console.log(new Date(2142099480000));
// console.log(Date.now()); //timestamp
// future.setFullYear(2040);
// console.log(future);

// const future = new Date(2037, 10, 18, 1, 23);
// console.log(+future);

// const compareDates = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24); //24 hours 60 min sec and 1000 mili sec

// const days1 = compareDates(
//   new Date(2037, 9, 18, 1, 23),
//   new Date(2037, 10, 18, 1, 23)
// );
// console.log(days1);

// const num = 39999999.12;

// const options = {
//   style: "currency",
//   unit: "mile-per-hour",
//   currency: "USD",
//   // useGrouping: false,
// };
// console.log(new Intl.NumberFormat("en-US", options).format(num));

//settimeout
// const ing = ["mushroom", "sausage"];
// const pizaaTimer = setTimeout(
//   (ing1, ing2) => console.log(`here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   ...ing
// );
// console.log("waiting");

// if (ing.includes("cheese")) clearTimeout(pizaaTimer);

// //setinterval
// setInterval(function () {
//   const now = new Date();
//   console.log(`${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()}`);
// }, 1000);
