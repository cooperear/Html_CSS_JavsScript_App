const API_BASE_URL = "http://localhost:8080/api/books";

export const getBooks = async () => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("서적 목록 불러오기 실패");
    return response.json();
};

export const createBook = async (bookData) => {
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "서적 등록 실패");
    }
    return response.json();
};

export const updateBook = async (bookId, bookData) => {
    const response = await fetch(`${API_BASE_URL}/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookData, id: bookId }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "서적 수정 실패");
    }
    return response.json();
};

export const deleteBook = async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/${bookId}`, { method: "DELETE" });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "서적 삭제 실패");
    }
};
