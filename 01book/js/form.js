
//전역변수
const API_BASE_URL = "http://localhost:8080";

//DOM 엘리먼트 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");

//Document Load 이벤트 처리하기
document.addEventListener("DOMContentLoaded", function () {
    console.log(`${API_BASE_URL}/api/books`);
    loadBooks();
});


bookForm.addEventListener("submit", function (event) {
    //기본으로 설정된 Event가 동작하지 않도록 하기 위함
    event.preventDefault();
    console.log("Form 이 체출 되었음....")

    //FormData 객체생성 <form>엘리먼트를 객체로 변환
    const bookFormData = new FormData(bookForm);
    bookFormData.forEach((value, key) => {
        console.log(key + ' = ' + value);
});


    const bookData = {
        title: bookFormData.get("title")?.trim(),
        author: bookFormData.get("author")?.trim(),
        isbn: bookFormData.get("isbn")?.trim(),
        price: bookFormData.get("price")?.trim(),
        publishDate: bookFormData.get("publishDate")?.trim(),
        detail: {
            description: bookFormData.get("description")?.trim(),
            language : bookFormData.get("language")?.trim(),
            pageCount : bookFormData.get("pageCount") ? Number(bookFormData.get("pageCount")) : null,
            publisher : bookFormData.get("publisher")?.trim(),
            coverImageUrl : bookFormData.get("coverImageUrl")?.trim(),
            edition : bookFormData.get("edition")?.trim(),
        }
    }

    //유효성 체크하는 함수 호출하기
    if (!validateBook(bookData)) {
        //검증체크 실패하면 리턴하기
        return;
    }

    //유효한 데이터 출력하기
    console.log(bookData);

}); //submit 이벤트

//입력항목의 값의 유효성을 체크하는 함수
function validateBook(book) {// 필수 필드 검사
    if (!book.title) {
        alert("제목을 입력해주세요.");
        return false;
    }
    if (!book.author) {
        alert("저자를 입력해주세요.");
        return false;
    }
    if (!book.isbn) {
        alert("ISBN을 입력해주세요.");
        return false;
    }
    if (!book.price) {
        alert("가격을 입력해주세요.");
        return false;
    }
    if (!book.publishDate) {
        alert("출판일을 입력해주세요.");
        return false;
    }

    return true;
}//validateStudent

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}//isValidEmail



function loadBooks() {
    console.log("책 목록 Load 중.....");
    fetch(`${API_BASE_URL}/api/books`) //Promise
        .then((response) => {
            if (!response.ok) {
                throw new Error("서적 목록을 불러오는데 실패했습니다!.");
            }
            return response.json();
        })
        .then((books) => renderBookTable(books))
        .catch((error) => {
            console.log("Error: " + error);
            alert("서적 목록을 불러오는데 실패했습니다!.");
        });
        
};

function renderBookTable(books) {
    console.log(books);
    bookTableBody.innerHTML = "";
    
    books.forEach((book) => {
        //<tr> 엘리먼트를 생성하기
        const row = document.createElement("tr");
        
        //<tr>의 content을 동적으로 생성
        row.innerHTML = `

                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn ? book.isbn : "-"}</td>
                    <td>${book.price ? book.price : "-"}</td>
                    <td>${book.publishDate ? book.publishDate : "-"}</td>

                    <td>${ book.detail?.description ?? "-"}</td>
                    <td>${ book.detail?.language ?? "-"}</td>
                    <td>${ book.detail?.pageCount ?? "-"}</td>
                    <td>${ book.detail?.publisher ?? "-"}</td>
                    <td>${ book.detail?.coverImageUrl ?? "-"}</td>
                    <td>${ book.detail?.edition ?? "-"}</td>
                    
                    <td>
                        <button class="edit-btn" onclick="editBook(${book.id})">수정</button>
                        <button class="delete-btn" onclick="deleteBook(${book.id})">삭제</button>
                    </td>
                `;
        //<tbody>의 아래에 <tr>을 추가시켜 준다.
        bookTableBody.appendChild(row);
    });    

}

