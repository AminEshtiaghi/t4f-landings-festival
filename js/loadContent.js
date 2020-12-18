const loadContent = () => {
    axios
        .post("https://run.mocky.io/v3/a395b025-2fc4-4f38-9947-15670b29a503", null)
        .then((res) => {
            if (res.status == 200) {
                var items = res.data.items
                Array.prototype.chunk = function (size) {
                    let result = [];
                    while (this.length) {
                        result.push(this.splice(0, size));
                    }
                    return result;
                }
                var shuffled = shuffle(items)
                var getData = (shuffle(shuffled).chunk(15))
            }
            getData.map((item) => {
                renderProduct(item)
            })
        })
};


const shuffle = (array) => {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const renderProduct = (array) => {
    let productContainer = document.querySelector('.products__container')
    array.map((item) => {
        axios
            .post("https://run.mocky.io/v3/cdd17e8d-9fde-4eb2-9321-865145117529", item)
            .then((res) => {
                if (res.status == 200) {
                    productContainer.innerHTML +=
                        `
                        <div class="products__container--item" id=${item}>
                        <img src="${res.data.products.image}" alt="" loading=lazy>
                        <p>نام اتاق فرار</p>
                        </div>
                    `
                    let items = document.getElementsByClassName('products__container--item')
                    let selected = []
                    for (let i = 0; i < items.length; i++) {
                        items[i].addEventListener('click', (e) => {
                            if (items[i].classList.contains('active')) {
                                items[i].classList.remove('active')
                                let elementId = items[i].id
                                if (selected.indexOf(elementId) !== -1) {
                                    selected.splice(selected.indexOf(elementId), 1);
                                }
                                document.querySelector('.footer__counter--number').innerHTML = 5 - selected.length
                                let thubmnail = document.querySelector('.user__selections')
                                thubmnail.innerHTML = ''
                                for (let i = 0; i < selected.length; i++) {
                                    thubmnail.innerHTML += `
                                        <div class="user__selections--item" id=${item}>
                                        <img src="${res.data.products.image}" width=75 height=75 alt="" loading=lazy>
                                        </div>
                                        `
                                }
                                for (let i = 0; i < 5 - selected.length; i++) {
                                    thubmnail.innerHTML += `
                                        <div class="user__selection--empty">
                                        <img src="./images/plus.svg" alt="" loading=lazy>
                                        </div>
                                        `
                                }
                            } else {
                                if (selected.length < 5) {
                                    items[i].classList.add('active')
                                    let elementId = items[i].id
                                    selected.push(elementId)
                                    document.querySelector('.footer__counter--number').innerHTML = 5 - selected.length
                                    let thubmnail = document.querySelector('.user__selections')
                                    thubmnail.innerHTML = ''
                                    for (let i = 0; i < selected.length; i++) {
                                        thubmnail.innerHTML += `
                                        <div class="user__selections--item" id=${selected[i]}>
                                        <img src="${res.data.products.image}" width=75 height=75 alt="" loading=lazy>
                                        </div>
                                        `
                                    }
                                    for (let i = 0; i < 5 - selected.length; i++) {
                                        thubmnail.innerHTML += `
                                        <div class="user__selection--empty">
                                        <img src="./images/plus.svg" alt="" loading=lazy>
                                        </div>
                                        `
                                    }
                                } else {
                                    MicroModal.show('full-choices');
                                }
                            }
                        })
                    }
                }

            })

    })
}

const submitForm = () => {
    let sumbitButton = document.querySelector('.footer__actions--submit')
    sumbitButton.addEventListener('click', () => {
        let fromDetail = document.getElementsByClassName('user__selections--item')
        let selectedItems = []
        for (let i = 0; i < fromDetail.length; i++) {
            selectedItems.push(fromDetail[i].id)
        }
        if (selectedItems.length == 0) {
            MicroModal.show('zero-modal');
        } else if (selectedItems.length < 5) {
            MicroModal.show('still-modal');
            document.querySelector("#reminder-item").innerHTML =
                `
            شما هنوز 
            ${5 - (selectedItems.length)}
            انتخاب دیگر دارید.
            `
        } else {
            axios
                .post("https://run.mocky.io/v3/a395b025-2fc4-4f38-9947-15670b29a503", selectedItems)
                .then((res) => {
                    MicroModal.show('success-modal');
                    document.querySelector('.footer__actions--submit').disabled = true
                })
        }

    })
}

const submitSmallForm = () => {
    let fromDetail = document.getElementsByClassName('user__selections--item')
    let selectedItems = []
    for (let i = 0; i < fromDetail.length; i++) {
        selectedItems.push(fromDetail[i].id)
    }
    axios
        .post("/festival/rooms/submit", {ids: selected})
        .then((res) => {
            if (closeWindow)  {
                MicroModal.close('still-modal');
            }
            MicroModal.show('success-modal');
            document.querySelector('.footer__actions--submit').disabled = true
        })
}



const search = () => {
    let searchInput = document.querySelector("#search")
    searchInput.addEventListener("keyup", () => {
        searchValue = searchInput.value
        if (searchValue.length >= 3) {
            axios
                .post("https://run.mocky.io/v3/a395b025-2fc4-4f38-9947-15670b29a503", searchValue)
                .then((res) => {
                    document.querySelector('.products__container').innerHTML = ''
                    renderProduct(res.data.items)
                })
        }
    })
}


window.onload = submitForm()
window.onload = loadContent()
window.onload = search()