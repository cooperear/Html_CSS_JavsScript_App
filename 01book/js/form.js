//전역변수
const API_BASE_URL = "http://localhost:8080";

//DOM 엘리먼트 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");
const submitButton = document.querySelector("button[type='submit']");
const cancelButton = document.querySelector(".cancel-btn");
const formErrorSpan = document.getElementById("formError");

let editingBookId = null;


//Document Load 이벤트 처리하기
document.addEventListener("DOMContentLoaded", function () {
    console.log(`${API_BASE_URL}/api/books`);
    loadBooks();
});

cancelButton.addEventListener('click', function() {
    resetForm();
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
        price: bookFormData.get("price") ? Number(bookFormData.get("price").trim()) : null,
        publishDate: bookFormData.get("publishDate")?.trim(),
        detail: {
            id: editingBookId,
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

    //서버에 책 데이터 전송
    if (editingBookId) {
        updateBook(editingBookId, bookData);
    } else {
        createBook(bookData);
    }

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
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}//isValidEmail

function createBook(bookData){
    console.log("asdasdsad");
    fetch(`${API_BASE_URL}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)  //Object => json
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 409) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '중복 되는 정보가 있습니다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '서적 등록에 실패했습니다.')
                }
            }
            return response.json();
        })

        .then((result) => {
            showSuccess("서적이 성공적으로 등록되었습니다!");
            resetForm();
            loadBooks();
        })
        .catch((error) => {
            console.log('Error : ', error);
            showError(error.message);
        });
}

function updateBook(bookId, bookData) {
    bookData.id = bookId;
    fetch(`${API_BASE_URL}/api/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
    })
    .then(async (response) => {
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 409) {
                throw new Error(`${errorData.message} ( 에러코드: ${errorData.statusCode} )` || '중복 되는 정보가 있습니다.');
            } else if (response.status === 404) {
                throw new Error(`${errorData.message} ( 에러코드: ${errorData.statusCode} )` || '존재하지 않는 서적입니다.');
            } else {
                throw new Error(errorData.message || '서적 수정에 실패했습니다.');
            }
        }
        return response.json();
    })
    .then(() => {
        
        showSuccess("서적이 성공적으로 수정되었습니다!");
        
        resetForm();

        loadBooks();
    })
    .catch((error) => {
        console.log('Error : ', error);
        alert(error.message);
    });
}



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


//삭제 함수
function deleteBook(bookId, bookTitle) {
    if (!confirm(`'${bookTitle}' 서적을 정말로 삭제하시겠습니까?`)) {
        return;
    }
    console.log('삭제처리 ...');

    fetch(`${API_BASE_URL}/api/books/${bookId}`, {
        method: 'DELETE'
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 404) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '존재하지 않는 서적입니다다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '삭제에 실패했습니다.')
                }
            }
            showSuccess("서적이 성공적으로 삭제되었습니다!");
            loadBooks();
        })
        .catch((error) => {
            console.log('Error : ', error);
            showError(error.message);
        });
}//deleteBook



function editBook(bookId) {
    fetch(`${API_BASE_URL}/api/books/${bookId}`)
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 404) {
                    throw new Error(errorData.message || '존재하지 않는 서적입니다.');
                }
            }
            return response.json();
        })
        .then((book) => {
            //Form에 데이터 채우기
            bookForm.title.value = book.title;
            bookForm.author.value = book.author;
            bookForm.isbn.value = book.isbn;
            bookForm.price.value = book.price;
            bookForm.publishDate.value = book.publishDate;
            if (book.detail) {
                bookForm.description.value = book.detail.description ;
                bookForm.language.value = book.detail.language;
                bookForm.pageCount.value = book.detail.pageCount;
                bookForm.publisher.value = book.detail.publisher;
                bookForm.coverImageUrl.value = book.detail.coverImageUrl;
                bookForm.edition.value = book.detail.edition || '-';
            }


            editingBookId = bookId;

            //버튼의 타이틀을 등록 => 수정으로 변경
            submitButton.textContent = "서적 수정";
            //취소 버튼을 활성화
            cancelButton.style.display = 'inline-block';
        })
        .catch((error) => {
            console.log('Error : ', error);
            alert(error.message);
        });
}//editBook


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
                        <button class="delete-btn" onclick="deleteBook(${book.id}, '${book.title}')">삭제</button>
                    </td>
                `;
        //<tbody>의 아래에 <tr>을 추가시켜 준다.
        bookTableBody.appendChild(row);
    });    

}







//성공 메시지 출력
function showSuccess(message) {
    formErrorSpan.textContent = message;
    formErrorSpan.style.display = 'block';
    formErrorSpan.style.color = '#28a745';
}
//에러 메시지 출력
function showError(message) {
    formErrorSpan.textContent = message;
    formErrorSpan.style.display = 'block';
    formErrorSpan.style.color = '#dc3545';
}
//메시지 초기화
function clearMessages() {
    formErrorSpan.style.display = 'none';
}

function resetForm() {
    //form 초기화
    bookForm.reset();
    //수정 Mode 설정하는 변수 초기화
     editingBookId = null;
    //submit 버튼의 타이틀을 학생 등록 변경
    submitButton.textContent = "서적 등록";
    //cancel 버튼의 사라지게
    cancelButton.style.display = 'none';
    //error message 초기화
    clearMessages();
}//resetForm
