if (typeof document !== 'undefined') {
    class Config {
        static loginPage: HTMLDivElement = <HTMLDivElement>document.getElementById("loginPage");
        static gamePage: HTMLDivElement = <HTMLDivElement>document.getElementById("gamePage");
    }

    class User {
        name: string;
        burger: number;
        burgerIncome: number;
        dailyIncome: number;
        age: number;
        day: number;
        money: number;
        items: Item[];
        intervalId: NodeJS.Timer = null;

        constructor(name: string, burger: number, burgerIncome: number, dailyIncome: number, age: number, day: number, money: number, items: Item[]) {
            this.name = name;
            this.burger = burger;
            this.burgerIncome = burgerIncome;
            this.dailyIncome = dailyIncome;
            this.age = age;
            this.day = day;
            this.money = money;
            this.items = items;
            this.intervalId = null;
        }
    }

    class Item {
        itemName: string;
        count: number;
        max: number;
        price: number;
        earning: number;
        type: string;
        img: string;
        constructor(itemName: string, count: number, max: number, price: number, earning: number, type: string, img: string) {
            this.itemName = itemName;
            this.count = count;
            this.max = max;
            this.price = price;
            this.earning = earning;
            this.type = type;
            this.img = img;
        }
    }

    class View {
        static displayBlock(ele: HTMLElement) {
            ele.classList.add("d-block");
            ele.classList.remove("d-none");
        }

        static displayNone(ele: HTMLElement) {
            ele.classList.add("d-none");
            ele.classList.remove("d-block");
        }

        static mainGameContaier(user: User) {
            const main: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            main.classList.add("container");
            main.innerHTML =
                `
                <div class="d-block d-sm-flex justify-content-center p-0 p-lg-2" id="coalescence">
                    <div class="col-sm-4 p-1 p-lg-2" id="left"></div>
                    <div class="col-sm-8 p-1 p-lg-2">
                        <div class="overflow-auto mt-lg-3 mt-1" id="right">
                    </div>
                </div>
            `;
            const left: HTMLDivElement = <HTMLDivElement>main.querySelectorAll("#left")[0];
            const right: HTMLDivElement = <HTMLDivElement>main.querySelectorAll("#right")[0];
            left.append(View.leftContainer(user));
            right.append(View.rightContainer(user));
            main.append(left);
            main.append(right);
            return main;
        }

        static leftContainer(user: User) {
            const left: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            left.classList.add("left");
            left.innerHTML =
                `
                <div class="text-center text-white" id="burgerInfo">
                    <h5 id="burgerCount">${user.burger} Burgers</h5>
                    <p>One click ￥${user.burgerIncome}</p>
                </div>
                <div class="mt-1 mt-sm-4" id="burgerClick">
                    <img src="./imgs/burger.png" class="hover img-fluid">
                </div>
            `;
            left.querySelectorAll("#burgerClick")[0].addEventListener("click", () => {
                Controller.clickBurger(user);
            })
            return left;
        }

        static rightContainer(user: User) {
            const right: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            right.classList.add("right");
            right.append(View.infoContainer(user));
            right.append(View.itemsContainer(user, user.items))
            return right;
        }

        static infoContainer(user: User) {
            const info: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            info.classList.add("info");
            info.innerHTML =
                `
                <div>
                    <p class="col-6 bg-warning">${user.name}</p>
                </div>
                <div>                        
                    <p id="age" class="col-6 bg-warning">${user.age} years old</p>
                </div>
                <div>
                    <p id="days" class="col-6 bg-warning">${user.day} days</p>
                </div>
                <div>
                    <p id="money" class="col-6 bg-warning">¥${user.money}</p>
                </div>
            `
            return info;
        }

        static itemsContainer(user: User, itemList: Item[]) {
            const items: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            items.setAttribute("id", "items");
            for (let i = 0; i < itemList.length; i++) {
                const item = document.createElement("div");
                item.classList.add("d-flex", "hover", "align-items-center", "w-95");
                const itemInfo = itemList[i];
                const unit = itemInfo.type === "ability" ? "/click" : itemInfo.type === "investment" ? "% / sec" : "/sec";
                item.innerHTML +=
                    `
                <div class="itemImg col-sm-3 d-sm-block d-none p-1">
                    <img src="${itemInfo.img}" class="img-fluid"/>
                </div>
                <div class="itemInfo col-sm-9 col-12 px-3 text-wrap">
                    <div class="d-flex justify-content-between align-items-center pb-3">
                        <p class="itemName col-5 text-start">${itemInfo.itemName}</p>
                        <p class="purchaseNumber col-5 text-end">${itemInfo.count}</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="itemValue col-5 text-start text-break">¥${itemInfo.price}</p>
                        <p class="income col-5 text-end text-break">¥${itemInfo.earning}${unit}</p>
                    </div>
                </div>
                `;
                item.addEventListener("click", () => {
                    View.displayNone(items);
                    Config.gamePage.querySelectorAll("#right")[0].append(View.purchaseContainer(user, itemInfo, items));
                });
                items.append(item);
            }
            items.append(View.configButtons(user));
            return items;
        }

        static purchaseContainer(user: User, item: Item, itemsCon: HTMLDivElement) {
            const purchase: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            const unit: string = item.type === "ability" ? "/click" : item.type === "investment" ? "% / sec" : "/sec";
            purchase.innerHTML =
                `
                <div class="d-flex justify-content-between align-items-center ml-3">
                    <div>
                        <h5>${item.itemName}</h5>
                        <p>Max purchases: ${item.max}</p>
                        <p>Price: ¥${item.price}</p>
                        <p>Earn ¥${item.earning}${unit}</p>
                    </div>
                    <div class="col-6">
                        <img src="${item.img}" class="img-fluid">
                    </div>
                </div>
                <div class="col-12">
                    <p>How many would you like to buy?</p>
                    <input type="number" placeholder="0" max="${item.max}" min="0"} class="col-12 form-control"/>
                    <div id="total" class="d-flex justify-content-end"></div>
                </div>
                <div class="d-flex justify-content-between mt-3 ml-3">
                    <button id="backBtn" class="btn btn-outline-primary col-5 bg-light" id="goBack">Go Back</button>
                    <button id="purchaseBtn" class="btn btn-outline-primary col-5 bg-light" id="purchase">Purchase</button>
                </div>
            `
            // calculate total price
            // listening the change of the counter input value
            purchase.querySelectorAll("input")[0].addEventListener("change", () => {
                const total: HTMLParagraphElement = <HTMLParagraphElement>document.createElement("p");
                const purchaseCount: number = parseInt(purchase.querySelectorAll("input")[0].value);
                const totalCost: number = purchaseCount * item.price;

                purchase.querySelectorAll("#total")[0].innerHTML = '';
                total.innerHTML = `total: ¥${totalCost}`;
                purchase.querySelectorAll("#total")[0].append(total);
            });

            // back to the item list
            purchase.querySelectorAll("#backBtn")[0].addEventListener("click", () => {
                View.displayNone(purchase);
                View.displayBlock(itemsCon);
            });

            // purchase the item
            purchase.querySelectorAll("#purchaseBtn")[0].addEventListener("click", () => {
                const purchaseCount: number = parseInt(purchase.querySelectorAll("input")[0].value);
                const totalCost: number = purchaseCount * item.price;

                if (purchaseCount <= 0) {
                    alert("Invalid number. Please enter 1 or more.");
                    return;
                }
                else if (user.money < totalCost) {
                    alert("You don't have enough! Earn! Earn!! Earn!!!!!");
                    return;
                }

                // only when the OK is clicked, proceed to purchase
                const confirmation: boolean = confirm("Determine the purchase?");
                if (confirmation) {
                    item.count += parseInt(purchase.querySelectorAll("input")[0].value);
                    user.dailyIncome += item.earning * purchaseCount;
                    user.money -= totalCost;
                    Config.gamePage.innerHTML = '';
                    Config.gamePage.append(View.mainGameContaier(user));
                }
            })
            return purchase;
        }

        static configButtons(user: User) {
            const buttonsCon: HTMLDivElement = document.createElement("div");
            buttonsCon.classList.add("buttons");
            buttonsCon.innerHTML =
                `
                <button id="dontSave" class="btn btn-outline-primary bg-white mr-3">END WITHOUT SAVE</button>
                <button id="save" class="btn btn-primary mr-3">SAVE AND END</button>
            `

            buttonsCon.querySelectorAll("#dontSave")[0].addEventListener("click", () => {
                Controller.dontSave(user);
            });

            buttonsCon.querySelectorAll("#save")[0].addEventListener("click", () => {
                Controller.save(user);
            });
            return buttonsCon;
        }
    }

    class Controller {
        static start() {
            Config.loginPage.querySelectorAll(".sign-up-btn")[0].addEventListener("click", () => {
                Controller.signUp();
            })
            Config.loginPage.querySelectorAll(".login-btn")[0].addEventListener("click", () => {
                Controller.login();
            })
        }

        static createAccount(userName: string) {
            const items = [
                new Item("Flip Machine", 0, 500, 15000, 25, "ability", "./imgs/Flip Machine.png"),
                new Item("ETF Stock", 0, Infinity, 300000, 0.1, "investment", "./imgs/ETF Stock.png"),
                new Item("ETF Bonds", 0, Infinity, 300000, 0.07, "investment", "./imgs/ETF Bonds.png"),
                new Item("Lemonade Stand", 0, 1000, 30000, 30, "real estate", "./imgs/Lemonade Stand.png"),
                new Item("Ice Cream Truck", 0, 500, 100000, 120, "real estate", "./imgs/Ice Cream Truck.png"),
                new Item("House", 0, 100, 20000000, 32000, "real estate", "./imgs/House.png"),
                new Item("Town House", 0, 100, 40000000, 64000, "real estate", "./imgs/Town House.png"),
                new Item("Mansion", 0, 20, 250000000, 500000, "real estate", "./imgs/Mansion.png"),
                new Item("Industrial Space", 0, 10, 1000000000, 2200000, "real estate", "./imgs/Industorial Space.png"),
                new Item("Hotel Skyscraper", 0, 5, 10000000000, 25000000, "real estate", "./imgs/Hotel Skyscraper.png"),
                new Item("Bullet-Speed Sky Railway", 0, 1, 10000000000000, 30000000000, "real estate", "./imgs/Bullet-Speed Sky Railway.png"),
            ]
            return new User(userName, 0, 500, 0, 20, 1, 0, items);
        }

        static signUp() {
            const nameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("nameInput");
            const userName: string = nameInput.value;
            if (userName === "") {
                alert("Please type your name.");
            } else if (localStorage.getItem(userName) !== null) {
                alert(`${userName} is already used. Please sign up with other name.`);
            } else {
                const account = Controller.createAccount(userName);
                Config.gamePage.innerHTML = '';
                Controller.displayGame(account);
            }
        }

        static login() {
            const nameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("nameInput");
            const userName: string = nameInput.value;
            if (userName === "") {
                alert("Please type your name.");
                return;
            }
            // if the user name does not exists in the storage,
            // display alert
            if (localStorage.getItem(userName) === null) {
                alert("This user does not exist. Please sign up.");
                return;
            }
            // convert the user information to JSON
            const accountInfo = JSON.parse(localStorage.getItem(userName));
            const account = new User(accountInfo.name, accountInfo.burger, accountInfo.burgerIncome, accountInfo.dailyIncome, accountInfo.age, accountInfo.day, accountInfo.money, accountInfo.items);
            Controller.displayGame(account);
        }


        static displayGame(user: User) {
            Controller.startDayTimer(user);
            Config.gamePage.innerHTML = '';
            Config.gamePage.append(View.mainGameContaier(user));
            View.displayBlock(Config.gamePage);
            View.displayNone(Config.loginPage);
        }

        static clickBurger(user: User) {
            user.burger++;
            user.money += user.burgerIncome;
            Config.gamePage.querySelectorAll("#burgerCount")[0].innerHTML = '';
            Config.gamePage.querySelectorAll("#burgerCount")[0].innerHTML = `${user.burger} Burgers`
            Config.gamePage.querySelectorAll("#money")[0].innerHTML = '';
            Config.gamePage.querySelectorAll("#money")[0].innerHTML = `¥${user.money}`;
        }

        static save(user: User) {
            const jsonEncoded: string = JSON.stringify(user);
            localStorage.setItem(user.name, jsonEncoded);
            clearInterval(user.intervalId);
            alert("Account is saved. You will go back to the login page.");
            Config.gamePage.innerHTML = `<div id="gamePage" class="col-12 bg-warning"> `
            View.displayBlock(Config.loginPage);
        }

        static dontSave(user: User) {
            const confirmation: boolean = confirm("Want to go back to login page? The progress won't be saved.");
            if (confirmation === true) {
                clearInterval(user.intervalId);
                View.displayNone(Config.gamePage);
                View.displayBlock(Config.loginPage);
            }
        }

        static startDayTimer(user: User) {
            // clear current interval before setting
            clearInterval(user.intervalId);
            // set new interval in this func, not in displayGame
            user.intervalId = setInterval(() => {
                // console.log(user.day+1);
                user.day++;
                user.money += user.dailyIncome;
                // rerender the info
                Config.gamePage.querySelectorAll("#days")[0].innerHTML = '';
                Config.gamePage.querySelectorAll("#days")[0].append(`${user.day} days`);
                Config.gamePage.querySelectorAll("#money")[0].innerHTML = '';
                Config.gamePage.querySelectorAll("#money")[0].append(`¥${user.money}`);

                if (user.day % 365 === 0) {
                    user.age++;
                    Config.gamePage.querySelectorAll("#age")[0].innerHTML = '';
                    Config.gamePage.querySelectorAll("#age")[0].append(`${user.age} years old`);
                }
            }, 1000)
        }
    }

    if (typeof document !== 'undefined') {
        Controller.start();
    }
}

