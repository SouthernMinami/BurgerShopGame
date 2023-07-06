if (typeof document !== 'undefined') {
    var Config_1 = /** @class */ (function () {
        function Config() {
        }
        Config.loginPage = document.getElementById("loginPage");
        Config.gamePage = document.getElementById("gamePage");
        return Config;
    }());
    var User_1 = /** @class */ (function () {
        function User(name, burger, burgerIncome, dailyIncome, age, day, money, items) {
            this.intervalId = null;
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
        return User;
    }());
    var Item_1 = /** @class */ (function () {
        function Item(itemName, count, max, price, earning, type, img) {
            this.itemName = itemName;
            this.count = count;
            this.max = max;
            this.price = price;
            this.earning = earning;
            this.type = type;
            this.img = img;
        }
        return Item;
    }());
    var View_1 = /** @class */ (function () {
        function View() {
        }
        View.displayBlock = function (ele) {
            ele.classList.add("d-block");
            ele.classList.remove("d-none");
        };
        View.displayNone = function (ele) {
            ele.classList.add("d-none");
            ele.classList.remove("d-block");
        };
        View.mainGameContaier = function (user) {
            var main = document.createElement("div");
            main.classList.add("container");
            main.innerHTML =
                "\n                <div class=\"d-block d-sm-flex justify-content-center p-0 p-lg-2\" id=\"coalescence\">\n                    <div class=\"col-sm-4 p-1 p-lg-2\" id=\"left\"></div>\n                    <div class=\"col-sm-8 p-1 p-lg-2\">\n                        <div class=\"overflow-auto mt-lg-3 mt-1\" id=\"right\">\n                    </div>\n                </div>\n            ";
            var left = main.querySelectorAll("#left")[0];
            var right = main.querySelectorAll("#right")[0];
            left.append(View.leftContainer(user));
            right.append(View.rightContainer(user));
            main.append(left);
            main.append(right);
            return main;
        };
        View.leftContainer = function (user) {
            var left = document.createElement("div");
            left.classList.add("left");
            left.innerHTML =
                "\n                <div class=\"text-center text-white\" id=\"burgerInfo\">\n                    <h5 id=\"burgerCount\">".concat(user.burger, " Burgers</h5>\n                    <p>One click \uFFE5").concat(user.burgerIncome, "</p>\n                </div>\n                <div class=\"mt-1 mt-sm-4\" id=\"burgerClick\">\n                    <img src=\"./imgs/burger.png\" class=\"hover img-fluid\">\n                </div>\n            ");
            left.querySelectorAll("#burgerClick")[0].addEventListener("click", function () {
                Controller_1.clickBurger(user);
            });
            return left;
        };
        View.rightContainer = function (user) {
            var right = document.createElement("div");
            right.classList.add("right");
            right.append(View.infoContainer(user));
            right.append(View.itemsContainer(user, user.items));
            return right;
        };
        View.infoContainer = function (user) {
            var info = document.createElement("div");
            info.classList.add("info");
            info.innerHTML =
                "\n                <div>\n                    <p class=\"col-6 bg-warning\">".concat(user.name, "</p>\n                </div>\n                <div>                        \n                    <p id=\"age\" class=\"col-6 bg-warning\">").concat(user.age, " years old</p>\n                </div>\n                <div>\n                    <p id=\"days\" class=\"col-6 bg-warning\">").concat(user.day, " days</p>\n                </div>\n                <div>\n                    <p id=\"money\" class=\"col-6 bg-warning\">\u00A5").concat(user.money, "</p>\n                </div>\n            ");
            return info;
        };
        View.itemsContainer = function (user, itemList) {
            var items = document.createElement("div");
            items.setAttribute("id", "items");
            var _loop_1 = function (i) {
                var item = document.createElement("div");
                item.classList.add("d-flex", "hover", "align-items-center", "w-95");
                var itemInfo = itemList[i];
                var unit = itemInfo.type === "ability" ? "/click" : itemInfo.type === "investment" ? "% / sec" : "/sec";
                item.innerHTML +=
                    "\n                <div class=\"itemImg col-sm-3 d-sm-block d-none p-1\">\n                    <img src=\"".concat(itemInfo.img, "\" class=\"img-fluid\"/>\n                </div>\n                <div class=\"itemInfo col-sm-9 col-12 px-3 text-wrap\">\n                    <div class=\"d-flex justify-content-between align-items-center pb-3\">\n                        <p class=\"itemName col-5 text-start\">").concat(itemInfo.itemName, "</p>\n                        <p class=\"purchaseNumber col-5 text-end\">").concat(itemInfo.count, "</p>\n                    </div>\n                    <div class=\"d-flex justify-content-between align-items-center\">\n                        <p class=\"itemValue col-5 text-start text-break\">\u00A5").concat(itemInfo.price, "</p>\n                        <p class=\"income col-5 text-end text-break\">\u00A5").concat(itemInfo.earning).concat(unit, "</p>\n                    </div>\n                </div>\n                ");
                item.addEventListener("click", function () {
                    View.displayNone(items);
                    Config_1.gamePage.querySelectorAll("#right")[0].append(View.purchaseContainer(user, itemInfo, items));
                });
                items.append(item);
            };
            for (var i = 0; i < itemList.length; i++) {
                _loop_1(i);
            }
            items.append(View.configButtons(user));
            return items;
        };
        View.purchaseContainer = function (user, item, itemsCon) {
            var purchase = document.createElement("div");
            var unit = item.type === "ability" ? "/click" : item.type === "investment" ? "% / sec" : "/sec";
            purchase.innerHTML =
                "\n                <div class=\"d-flex justify-content-between align-items-center ml-3\">\n                    <div>\n                        <h5>".concat(item.itemName, "</h5>\n                        <p>Max purchases: ").concat(item.max, "</p>\n                        <p>Price: \u00A5").concat(item.price, "</p>\n                        <p>Earn \u00A5").concat(item.earning).concat(unit, "</p>\n                    </div>\n                    <div class=\"col-6\">\n                        <img src=\"").concat(item.img, "\" class=\"img-fluid\">\n                    </div>\n                </div>\n                <div class=\"col-12\">\n                    <p>How many would you like to buy?</p>\n                    <input type=\"number\" placeholder=\"0\" max=\"").concat(item.max, "\" min=\"0\"} class=\"col-12 form-control\"/>\n                    <div id=\"total\" class=\"d-flex justify-content-end\"></div>\n                </div>\n                <div class=\"d-flex justify-content-between mt-3 ml-3\">\n                    <button id=\"backBtn\" class=\"btn btn-outline-primary col-5 bg-light\" id=\"goBack\">Go Back</button>\n                    <button id=\"purchaseBtn\" class=\"btn btn-outline-primary col-5 bg-light\" id=\"purchase\">Purchase</button>\n                </div>\n            ");
            // calculate total price
            // listening the change of the counter input value
            purchase.querySelectorAll("input")[0].addEventListener("change", function () {
                var total = document.createElement("p");
                var purchaseCount = parseInt(purchase.querySelectorAll("input")[0].value);
                var totalCost = purchaseCount * item.price;
                purchase.querySelectorAll("#total")[0].innerHTML = '';
                total.innerHTML = "total: \u00A5".concat(totalCost);
                purchase.querySelectorAll("#total")[0].append(total);
            });
            // back to the item list
            purchase.querySelectorAll("#backBtn")[0].addEventListener("click", function () {
                View.displayNone(purchase);
                View.displayBlock(itemsCon);
            });
            // purchase the item
            purchase.querySelectorAll("#purchaseBtn")[0].addEventListener("click", function () {
                var purchaseCount = parseInt(purchase.querySelectorAll("input")[0].value);
                var totalCost = purchaseCount * item.price;
                if (purchaseCount <= 0) {
                    alert("Invalid number. Please enter 1 or more.");
                    return;
                }
                else if (user.money < totalCost) {
                    alert("You don't have enough! Earn! Earn!! Earn!!!!!");
                    return;
                }
                // only when the OK is clicked, proceed to purchase
                var confirmation = confirm("Determine the purchase?");
                if (confirmation) {
                    item.count += parseInt(purchase.querySelectorAll("input")[0].value);
                    user.dailyIncome += item.earning * purchaseCount;
                    user.money -= totalCost;
                    Config_1.gamePage.innerHTML = '';
                    Config_1.gamePage.append(View.mainGameContaier(user));
                }
            });
            return purchase;
        };
        View.configButtons = function (user) {
            var buttonsCon = document.createElement("div");
            buttonsCon.classList.add("buttons");
            buttonsCon.innerHTML =
                "\n                <button id=\"dontSave\" class=\"btn btn-outline-primary bg-white mr-3\">END WITHOUT SAVE</button>\n                <button id=\"save\" class=\"btn btn-primary mr-3\">SAVE AND END</button>\n            ";
            buttonsCon.querySelectorAll("#dontSave")[0].addEventListener("click", function () {
                Controller_1.dontSave(user);
            });
            buttonsCon.querySelectorAll("#save")[0].addEventListener("click", function () {
                Controller_1.save(user);
            });
            return buttonsCon;
        };
        return View;
    }());
    var Controller_1 = /** @class */ (function () {
        function Controller() {
        }
        Controller.start = function () {
            Config_1.loginPage.querySelectorAll(".sign-up-btn")[0].addEventListener("click", function () {
                Controller.signUp();
            });
            Config_1.loginPage.querySelectorAll(".login-btn")[0].addEventListener("click", function () {
                Controller.login();
            });
        };
        Controller.createAccount = function (userName) {
            var items = [
                new Item_1("Flip Machine", 0, 500, 15000, 25, "ability", "./imgs/Flip Machine.png"),
                new Item_1("ETF Stock", 0, Infinity, 300000, 0.1, "investment", "./imgs/ETF Stock.png"),
                new Item_1("ETF Bonds", 0, Infinity, 300000, 0.07, "investment", "./imgs/ETF Bonds.png"),
                new Item_1("Lemonade Stand", 0, 1000, 30000, 30, "real estate", "./imgs/Lemonade Stand.png"),
                new Item_1("Ice Cream Truck", 0, 500, 100000, 120, "real estate", "./imgs/Ice Cream Truck.png"),
                new Item_1("House", 0, 100, 20000000, 32000, "real estate", "./imgs/House.png"),
                new Item_1("Town House", 0, 100, 40000000, 64000, "real estate", "./imgs/Town House.png"),
                new Item_1("Mansion", 0, 20, 250000000, 500000, "real estate", "./imgs/Mansion.png"),
                new Item_1("Industrial Space", 0, 10, 1000000000, 2200000, "real estate", "./imgs/Industorial Space.png"),
                new Item_1("Hotel Skyscraper", 0, 5, 10000000000, 25000000, "real estate", "./imgs/Hotel Skyscraper.png"),
                new Item_1("Bullet-Speed Sky Railway", 0, 1, 10000000000000, 30000000000, "real estate", "./imgs/Bullet-Speed Sky Railway.png"),
            ];
            return new User_1(userName, 0, 500, 0, 20, 1, 0, items);
        };
        Controller.signUp = function () {
            var nameInput = document.getElementById("nameInput");
            var userName = nameInput.value;
            if (userName === "") {
                alert("Please type your name.");
            }
            else if (localStorage.getItem(userName) !== null) {
                alert("".concat(userName, " is already used. Please sign up with other name."));
            }
            else {
                var account = Controller.createAccount(userName);
                Config_1.gamePage.innerHTML = '';
                Controller.displayGame(account);
            }
        };
        Controller.login = function () {
            var nameInput = document.getElementById("nameInput");
            var userName = nameInput.value;
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
            var accountInfo = JSON.parse(localStorage.getItem(userName));
            var account = new User_1(accountInfo.name, accountInfo.burger, accountInfo.burgerIncome, accountInfo.dailyIncome, accountInfo.age, accountInfo.day, accountInfo.money, accountInfo.items);
            Controller.displayGame(account);
        };
        Controller.displayGame = function (user) {
            Controller.startDayTimer(user);
            Config_1.gamePage.innerHTML = '';
            Config_1.gamePage.append(View_1.mainGameContaier(user));
            View_1.displayBlock(Config_1.gamePage);
            View_1.displayNone(Config_1.loginPage);
        };
        Controller.clickBurger = function (user) {
            user.burger++;
            user.money += user.burgerIncome;
            Config_1.gamePage.querySelectorAll("#burgerCount")[0].innerHTML = '';
            Config_1.gamePage.querySelectorAll("#burgerCount")[0].innerHTML = "".concat(user.burger, " Burgers");
            Config_1.gamePage.querySelectorAll("#money")[0].innerHTML = '';
            Config_1.gamePage.querySelectorAll("#money")[0].innerHTML = "\u00A5".concat(user.money);
        };
        Controller.save = function (user) {
            var jsonEncoded = JSON.stringify(user);
            localStorage.setItem(user.name, jsonEncoded);
            clearInterval(user.intervalId);
            alert("Account is saved. You will go back to the login page.");
            Config_1.gamePage.innerHTML = "<div id=\"gamePage\" class=\"col-12 bg-warning\"> ";
            View_1.displayBlock(Config_1.loginPage);
        };
        Controller.dontSave = function (user) {
            var confirmation = confirm("Want to go back to login page? The progress won't be saved.");
            if (confirmation === true) {
                clearInterval(user.intervalId);
                View_1.displayNone(Config_1.gamePage);
                View_1.displayBlock(Config_1.loginPage);
            }
        };
        Controller.startDayTimer = function (user) {
            // clear current interval before setting
            clearInterval(user.intervalId);
            // set new interval in this func, not in displayGame
            user.intervalId = setInterval(function () {
                // console.log(user.day+1);
                user.day++;
                user.money += user.dailyIncome;
                // rerender the info
                Config_1.gamePage.querySelectorAll("#days")[0].innerHTML = '';
                Config_1.gamePage.querySelectorAll("#days")[0].append("".concat(user.day, " days"));
                Config_1.gamePage.querySelectorAll("#money")[0].innerHTML = '';
                Config_1.gamePage.querySelectorAll("#money")[0].append("\u00A5".concat(user.money));
                if (user.day % 365 === 0) {
                    user.age++;
                    Config_1.gamePage.querySelectorAll("#age")[0].innerHTML = '';
                    Config_1.gamePage.querySelectorAll("#age")[0].append("".concat(user.age, " years old"));
                }
            }, 1000);
        };
        return Controller;
    }());
    if (typeof document !== 'undefined') {
        Controller_1.start();
    }
}
