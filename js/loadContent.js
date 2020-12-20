let selected = [];

const loadContent = () => {
    let current = window.location;

    axios
        .get("/festival/rooms/ids", null)
        .then((res) => {
            if (res.status === 200) {
                var items = res.data.items;
                Array.prototype.chunk = function (size) {
                    let result = [];
                    while (this.length) {
                        result.push(this.splice(0, size));
                    }
                    return result;
                };
                var shuffled = shuffle(items);
                var getData = (shuffle(shuffled).chunk(15));
            }
            getData.map((item) => {
                renderProduct(item)
            })
        }).catch((res) => {
            window.location = "/login?_back="+current;

        });
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
};

const renderProduct = (array) => {
    let productContainer = document.querySelector('.products__container');

    axios
        .get("/festival/rooms/items", {
            params: {
                ids: array
            }
        })
        .then((res) => {
            if (res.status === 200) {

                res.data.rooms.map(function (room) {
                    productContainer.innerHTML +=
                        `
                        <div class="products__container--item" id="${room.id}" onclick="vote(${room.id});" >
                            <img src="${room.image}?w=210&q=75" alt="${room.name}" loading="lazy" >
                            <p>${room.name}</p>
                        </div>
                        `;

                    if (room.selected) {
                        vote(room.id);
                    }
                });
            }

        });

};

function vote(roomId) {
    let item = document.getElementById(roomId);

    if (item.classList.contains('active')) {
        item.classList.remove('active');

        if (selected.indexOf(item.id) !== -1) {
            selected.splice(selected.indexOf(item.id), 1);
        }

        refreshTumbnails();


    } else {

        if (selected.length < 5) {
            item.classList.add('active');

            selected.push(item.id);
            refreshTumbnails();

        } else {
            MicroModal.show('full-choices');

        }

    }

}

function refreshTumbnails() {
    document.querySelector('.footer__counter--number').innerHTML = 5 - selected.length;
    let thumbnail = document.querySelector('.user__selections');
    thumbnail.innerHTML = '';

    for (let i = 0; i < selected.length; i++) {
        let selectedItem = document.getElementById(selected[i]);
        let image = selectedItem.getElementsByTagName('img')[0];
        let selectedName = selectedItem.getElementsByTagName('p')[0];

        thumbnail.innerHTML += `
            <div class="user__selections--item" id="${selectedItem.id}" onclick="vote(${selectedItem.id});" >
                <img src="${image.src}?w=75&q=75" width="75" height="75" alt="${selectedName.innerHTML}" loading="lazy" />
            </div>
            `;
    }
    for (let i = 0; i < 5 - selected.length; i++) {
        thumbnail.innerHTML += `
            <div class="user__selection--empty">
                <img src="./images/plus.svg" alt="not selected" loading="lazy">
            </div>
            `;
    }

}

const submitForm = () => {
    if (selected.length === 0) {
        MicroModal.show('zero-modal');

    } else if (selected.length < 5) {
        document.querySelector("#reminder-item").innerHTML =
            `
            شما هنوز 
            ${5 - (selected.length)}
            انتخاب دیگر دارید.
            `;
        MicroModal.show('still-modal');

    } else {
        submitSmallForm(false);

    }

};

const submitSmallForm = (closeWindow = true) => {
    axios
        .post("/festival/rooms/submit", {
            ids: selected
        })
        .then((res) => {
            if (closeWindow) {
                MicroModal.close('still-modal');
            }
            MicroModal.show('success-modal');
            document.querySelector('.footer__actions--submit').disabled = true
        })
};



const search = () => {
    let searchInput = document.querySelector("#search")
    searchInput.addEventListener("keyup", () => {
        let searchValue = searchInput.value;
        if (searchValue.length >= 3) {
            axios
                .get("/festival/rooms/search?q=" + searchValue, null)
                .then((res) => {
                    document.querySelector('.products__container').innerHTML = '';
                    renderProduct(res.data.items);
                });
        }
    })
};

const showList = (e) => {
    if (e.getAttribute('is-open') == "false") {
        e.setAttribute('is-open', true)
        let footer = document.querySelector("#footer")
        footer.style.display = "flex"
        e.style.bottom = "110px"
        e.innerHTML = 'بستن لیست'
    }
    else {
        let footer = document.querySelector("#footer")
        e.setAttribute('is-open', false)
        footer.style.display = "none"
        e.style.bottom = "0px"
        e.innerHTML = 'مشاهده لیست'
    }
}


window.onload = loadContent();
window.onload = search();