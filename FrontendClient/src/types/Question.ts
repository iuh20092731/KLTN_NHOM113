interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    roles: string[] | null;
}
interface Reply {
    content: string;
    parentId: number | null;
    createdDate: string;
    user: User | null;
    replies: Reply[]; // Nested replies
    commentId: number;
}

interface Comment {
    id: number;
    content: string;
    createDate: string;
    likeCount: number;
    user: User | null;
    comments: Reply[];
}

export interface ApiQuestionResponse {
    code: number;
    result: {
      content: Comment[];
      pageable: {
        pageNumber: number;
        pageSize: number;
        sort: { sorted: boolean; empty: boolean; unsorted: boolean };
        offset: number;
        paged: boolean;
        unpaged: boolean;
      };
      totalPages: number;
      totalElements: number;
      last: boolean;
      size: number;
      number: number;
      sort: { sorted: boolean; empty: boolean; unsorted: boolean };
      numberOfElements: number;
      first: boolean;
      empty: boolean;
    };
}
