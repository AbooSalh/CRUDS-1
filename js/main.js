// vars
let title = document.querySelector("#title");
let price = document.querySelector("#price");
let taxes = document.querySelector("#taxes");
let ads = document.querySelector("#ads");
let discount = document.querySelector("#discount");
let total = document.querySelector("#total");
let count = document.querySelector("#count");
let category = document.querySelector("#category");
let submit = document.querySelector("#submit");
let inputs = document.querySelectorAll("input");
let createInputs = document.querySelectorAll(".inputs input");
let mood = "create";
let tmp;
let date = new Date()
// go to next input
inputs.forEach((ele, index) => {
    ele.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            if (
                inputs[index + 1] !== undefined &&
                inputs[index + 1].id !== "search"
            ) {
                inputs[index + 1].focus();
            } else {
                submit.click();
            }
        }
    });
});
// total
function getTotal() {
    if (price.value !== "") {
        let result =
            +price.value +
            +((+price.value * +taxes.value) / 100) +
            (+price.value * +ads.value) / 100 -
            (+price.value * +discount.value) / 100;
        total.style.backgroundColor = "green";
        if (result.toString().length == 1) {
            total.innerHTML = `0${result}`;
        } else {
            total.innerHTML = `${result}`;
        }
    } else {
        total.style.backgroundColor = "red";
        total.innerHTML = `00.000`;
    }
}
let productsArray = [];
// create product
if (localStorage.getItem("products")) {
    productsArray = JSON.parse(localStorage.getItem("products"));
    showData();
}
submit.addEventListener("click", () => {
    
    let newProduct = {
        title     : title.value.toLowerCase(),
        price     : +price.value,
        taxes     : +taxes.value,
        ads       : +ads.value,
        discount  : +discount.value,
        total     : +total.innerHTML,
        count     : +count.value,
        category  : category.value.toLowerCase(),
        company   : "",
        date:{
            minutes: date.getMinutes(),
            hours  : date.getHours(),
            day    : date.getDay(),
            month  : date.getMonth(),
            year   : date.getFullYear(),
        }
    };
    if (taxes.value == "") {
        newProduct.taxes = 0;
    }
    if (ads.value == "") {
        newProduct.ads = 0;
    }
    if (discount.value == "") {
        newProduct.discount = 0;
    }
    if (category.value == "") {
        newProduct.category = "No Category";
    }
    if (count.value == "") {
        newProduct.count = 1;
    }


    if (price.value !== "" && title.value !== "") {
        // the product Object
        if (mood == "create") {
            if (+newProduct.count > 1) {
                for (let i = 0; i < newProduct.count; i++) {
                    productsArray.push(newProduct);
                }
            } else {
                productsArray.push(newProduct);
            }

        } else {
            if(productsArray[tmp] == newProduct.lastUpdate ){
                return 
            }
            productsArray[tmp] = newProduct;
            mood = "create"
            submit.innerHTML = "create"
            count.style.display = "block"
        }
        clearData();

        
     }else{
     }
     // save local storage
     localStorage.setItem("products", JSON.stringify(productsArray));
     showData();





});
// input red border
price.onblur = ()=>{
    if(price.value == ""){
        price.style.border = "solid red 1px"
    }
}
title.onblur = ()=>{
    if(title.value ==""){
        title.style.border = "solid red 1px"
    }
}
price.onfocus = ()=>{
    price.style.border = ""
}
title.onfocus = ()=>{
    title.style.border = ""
}
// clear inputs
function clearData() {
    createInputs.forEach((ele) => {
        ele.value = "";
    });
    total.innerHTML = "00.000";
}
// read
function showData() {
    
    getTotal()
    let table = "";
    let productsC = "";
    productsArray.forEach((ele, index) => {
        table += ` 
        <tr>
        <td>${index + 1}</td>
        <td>${ele.title}</td>
        <td>${ele.price}$</td>
        <td>${(ele.price * +ele.taxes) / 100}$ (${ele.price}%)</td>
        <td>${(ele.price * +ele.ads) / 100}$ (${ele.ads}%)</td>
        <td>${(ele.price * +ele.discount) / 100}$ (${ele.discount}%)</td>
        <td style="white-space: nowrap;">${ele.total}$</td>
        <td>${ele.category}</td>
        <td><button onclick="updateData(${index})" id="update">update</button></td>
        <td><button onclick="deleteData(${index})" id="delete">delete</button></td>
        <tr>`;
        productsC += `
        <div class="product">
            <div class="mainInfo">
                <span class="id">ID : <span>${index + 1}</span></span>
                <span class="title">Title : <span>${ele.title}</span> </span>
                <span class="category">Category : <span>${ele.category}</span></span>
            
            </div>
            <hr>
            <div class="secondInfo">
                <div class="price">Price : <span>${ele.price}$<span></div>
                <div class="taxes">Taxes : <span>${(ele.price * +ele.taxes) / 100}$ (${ele.price}%)</span></div>
                <div class="ads">Ads : <span>${(ele.price * +ele.ads) / 100}$ (${ele.ads}%)</span></div>
                <div class="discount">Discount : <span>${(ele.price * +ele.discount) / 100}$ (${ele.discount}%)</span></div>
            </div>
            <hr>
            <div class="lastInfo">
                <div class="total">total : <span>${ele.total}$</span></div>
                <div class="btns">
                    <button onclick="updateData(${index})" id="update">update</button></td>
                    <button onclick="deleteData(${index})" id="delete">delete</button></td>
                </div>
            </div>
        </div>
        `
    });
    document.getElementById("tbody").innerHTML = table;
    document.getElementById("products").innerHTML = productsC;
    let deletBtn = document.querySelector("#deleteAll");
    if (productsArray.length > 0) {
        deletBtn.innerHTML = `<button style="background-color:red;" onclick="deleteAll()">Delete All (${productsArray.length})</button>`;
    } else {
        deletBtn.innerHTML = "";
    }
}
// delete
function deleteData(i) {
    productsArray.splice(i, 1);
    localStorage.products = JSON.stringify(productsArray);
    showData();
    mood = "create"
    submit.innerHTML = "create"
    count.style.display = "block"
}
function deleteAll() {
    if (
        confirm(
            "Are you sure you want to delete all products\nIt will be removed from The Storage!!"
        ) == true
    ) {
        localStorage.clear();
        productsArray.splice(0);
        showData();
    } else {
        return;
    }
}
// update
function updateData(i) {
    title.value = productsArray[i].title;
    price.value = productsArray[i].price;
    taxes.value = productsArray[i].taxes;
    ads.value = productsArray[i].ads;
    discount.value = productsArray[i].discount;
    category.value = productsArray[i].category;
    getTotal();
    count.style.display = "none";
    submit.innerHTML = "Update";
    mood = "update"
    tmp = i;
    scroll({
        top:0,
        behavior:"smooth"
    })
}


// search
let searchCategory = document.querySelector("#searchCategory");
let searchTitle = document.querySelector("#searchTitle");
let searchMood = "title"
let searchBox = document.querySelector("#search")
function getSearchMood(id){
    let table = ""
    if (id == "searchTitle"){
        searchMood = "title";
    }else{
        searchMood = "category"
    }
    searchBox.placeholder = "Search by " + searchMood
    searchBox.focus();
    searchBox.value = "";
    showData()

}
function searchData(searchValue){
    let productsC = ""
    let table = ""
    if (searchMood == "title"){
        productsArray.forEach((ele,index)=>{
           if(ele.title.includes(searchValue.toLowerCase())){
            table += ` 
            <tr>
            <td>${index + 1}</td>
            <td>${ele.title}</td>
            <td>${ele.price}$</td>
            <td>${(ele.price * +ele.taxes) / 100}$ (${ele.price}%)</td>
            <td>${(ele.price * +ele.ads) / 100}$ (${ele.ads}%)</td>
            <td>${(ele.price * +ele.discount) / 100}$ (${ele.discount}%)</td>
            <td style="white-space: nowrap;">${ele.total}$</td>
            <td>${ele.category}</td>
            <td><button onclick="updateData(${index})" id="update">update</button></td>
            <td><button onclick="deleteData(${index})" id="delete">delete</button></td>
            <tr>`;
            productsC += `
            <div class="product">
                <div class="mainInfo">
                    <span class="id">ID : ${index + 1}</span>
                    <span class="title">Title : ${ele.title} </span>
                    <span class="category">Category : ${ele.category}</span>
                
                </div>
                <hr>
                <div class="secondInfo">
                    <div class="price">Price : ${ele.price}$</div>
                    <div class="taxes">Taxes : ${(ele.price * +ele.taxes) / 100}$ (${ele.price}%)</div>
                    <div class="ads">Ads : ${(ele.price * +ele.ads) / 100}$ (${ele.ads}%)</div>
                    <div class="discount">Discount : ${(ele.price * +ele.discount) / 100}$ (${ele.discount}%)</div>
                </div>
                <hr>
                <div class="lastInfo">
                    <div class="total">total : ${ele.total}$</div>
                    <div class="btns">
                        <button onclick="updateData(${index})" id="update">update</button></td>
                        <button onclick="deleteData(${index})" id="delete">delete</button></td>
                    </div>
                </div>
            </div>
            `
           } ;

            
        })
        
    }else{

        productsArray.forEach((ele,index)=>{
            if(ele.category.includes(searchValue.toLowerCase())){
             table += ` 
             <tr>
             <td>${index + 1}</td>
             <td>${ele.title}</td>
             <td>${ele.price}$</td>
             <td>${(ele.price * +ele.taxes) / 100}$ (${ele.price}%)</td>
             <td>${(ele.price * +ele.ads) / 100}$ (${ele.ads}%)</td>
             <td>${(ele.price * +ele.discount) / 100}$ (${ele.discount}%)</td>
             <td style="white-space: nowrap;">${ele.total}$</td>
             <td>${ele.category}</td>
             <td><button onclick="updateData(${index})" id="update">update</button></td>
             <td><button onclick="deleteData(${index})" id="delete">delete</button></td>
             <tr>`;
             productsC += `
             <div class="product">
                 <div class="mainInfo">
                     <span class="id">ID : ${index + 1}</span>
                     <span class="title">Title : ${ele.title} </span>
                     <span class="category">Category : ${ele.category}</span>
                 
                 </div>
                 <div class="secondInfo">
                     <div class="price">Price : ${ele.price}$</div>
                     <div class="taxes">Taxes : ${(ele.price * +ele.taxes) / 100}$ (${ele.price}%)</div>
                     <div class="ads">Ads : ${(ele.price * +ele.ads) / 100}$ (${ele.ads}%)</div>
                     <div class="discount">Discount : ${(ele.price * +ele.discount) / 100}$ (${ele.discount}%)</div>
                 </div>
                 <div class="lastInfo">
                     <div class="total">total : ${ele.total}$</div>
                     <div class="btns">
                         <button onclick="updateData(${index})" id="update">update</button></td>
                         <button onclick="deleteData(${index})" id="delete">delete</button></td>
                     </div>
                 </div>
             </div>
             `
            } 
 
             
         })

    }
    document.getElementById("tbody").innerHTML = table;
    document.getElementById("products").innerHTML = productsC;


}




// clean data
