// session storage for token
var saveToken = JSON.parse(sessionStorage.getItem("token"))

if (!saveToken) {
  alert("Please Log in First")
  container.innerHTML = null
  container.innerHTML = `<h3> Please Log in First</h3>`
}

let deleteProduct = document.getElementById("deleteProduct")

let deleteID = document.getElementById("deleteID")

deleteProduct.addEventListener("submit", (e) => {
  e.preventDefault()

  fetch(
    `https://wellnesswave-rs9y.onrender.com/users/delete/${deleteID.value}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${saveToken.token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      // console.log(res.msg)
      alert(res.msg)
      fetchData()
    })
    .catch((err) => console.log(err.msg))
})

let container = document.getElementById("product-container")
let pagination = document.getElementById("pagination")

// fetching Session Storage

window.addEventListener("load", () => {
  fetchData()
  console.log(1)
})
let page = 1
ProductLimit = 4

function fetchData() {
  fetch(`https://wellnesswave-rs9y.onrender.com/users/`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
      let length = res.users.length
      let total = Math.ceil(length / ProductLimit)
      // console.log(total)
      pagination.innerHTML = null
      for (let i = 1; i <= total; i++) {
        pagination.append(createbtn(i, i))
      }
      let data = res.users.slice(length - ProductLimit)
      console.log(2)
      getCardList(data)
    })
}

function createbtn(page, id) {
  let button = document.createElement("button")
  button.setAttribute("data-id", id)
  button.textContent = page
  button.addEventListener("click", (e) => {
    page = e.target.dataset.id
    fetchDataAfterPagination(page)
    // console.log(e.target.dataset.id,query)
  })
  return button
}
function fetchDataAfterPagination(page, query) {
  // console.log(page);
  fetch(
    `https://wellnesswave-rs9y.onrender.com/users/?page=${page}&limit=${ProductLimit}`
  )
    .then((res) => res.json())
    .then((res) => {
      console.log(res.users)
      console.log(page, ProductLimit)
      getCardList(res.users)
    })
}

// getCardList(product)
function getCardList(data) {
  let brand = {}
  let category = {}
  container.innerHTML = null
  let cardList = document.createElement("div")
  cardList.classList = "card-list"
  container.append(cardList)
  // console.log(data);
  data.forEach((element) => {
    let card = getCard(
      element._id,
      element.name,
      element.email,
      element.mobile,
      element.role,
      element.price,
      element.img,
      element.quantity
    )
    cardList.append(card)
  })
  console.log("Brand", brand)
  console.log("category", category)
  return cardList
}
function getCard(
  dataId,
  title,
  brand,
  category,
  rating,
  price,
  avatar,
  quantity
) {
  let card = document.createElement("div")
  card.classList = "card"
  card.setAttribute("data-id", dataId)
  // card.innerText=username;

  let imageCard = document.createElement("div")
  imageCard.classList = "card_img"

  let image = document.createElement("img")
  // console.log(avatar);
  image.src =
    "data:image/png;base64,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"
  image.setAttribute("alt", `${title} image`)

  let cardBody = document.createElement("div")
  cardBody.classList = "card_body"

  let nameCard = document.createElement("h4")
  nameCard.classList = "card_item"
  nameCard.classList = "card_title"
  nameCard.innerText = `${title}`

  let brandCard = document.createElement("h4")
  brandCard.classList = "card_item"
  brandCard.classList = "card_description"
  brandCard.innerHTML = `Email: ${brand}`
  //  Mobile: ${category}`;

  let ratingCard = document.createElement("h4")
  ratingCard.classList = "card_item"
  ratingCard.classList = "card_rating"
  ratingCard.innerHTML = `<i class="fa-sharp fa-solid fa-star" style="color: #212121;"></i> ${rating}`

  let ProductID = document.createElement("h4")
  ProductID.classList = "card_item"
  ProductID.classList = "card_description"
  ProductID.innerText = `User ID: ${dataId}`

  let roleCard = document.createElement("h4")
  roleCard.classList = "card_item"
  roleCard.classList = "card_quantity"
  roleCard.innerText = `User Role: ${rating}`

  let deleteUserId = document.createElement("button")
  deleteUserId.classList = "card_item"
  deleteUserId.classList = "card_delete"
  deleteUserId.id = "Submit"
  deleteUserId.innerText = `Delete`
  deleteUserId.setAttribute("data-id", dataId)

  deleteUserId.addEventListener("click", (e) => {
    // console.log(e.target.dataset.id)
    fetch(
      `https://wellnesswave-rs9y.onrender.com/users/delete/${e.target.dataset.id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${saveToken.token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        alert(res.msg)
        // console.log(res.msg)
        fetchData()
      })
      .catch((err) => {
        console.log(err)
      })
  })

  cardBody.append(
    ratingCard,
    nameCard,
    brandCard,
    ProductID,
    roleCard,
    deleteUserId
  )

  imageCard.append(image)

  card.append(imageCard, cardBody)

  return card
}
