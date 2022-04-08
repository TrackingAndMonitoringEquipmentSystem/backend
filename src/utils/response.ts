export class ResponseDto {
    successful: boolean;
    errorCode: string;
    message: string;
    data: any;
}


export function getResponse(errorCode: string, data: any): ResponseDto {
    const response = ResponseConstants.find((response) => {
        return response.errorCode === errorCode;
    });
    if(errorCode == '00') {
        response.data = data;
    }
    return response;
}

const ResponseConstants: ResponseDto[] = [
    {
        successful: true,
        errorCode: '00',
        message: 'success',
        data: {},
    },
    {
        successful: false,
        errorCode: '01',
        message: 'Waiting for approve',
        data: {},
    },
    {
        successful: false,
        errorCode: '02',
        message: 'Email not verify',
        data: {},
    },
    {
        successful: false,
        errorCode: '03',
        message: 'Invalid email',
        data: {},
    },
    {
        successful: false,
        errorCode: '04',
        message: 'cannot signin',
        data: {},
    },
    {
        successful: false,
        errorCode: '05',
        message: 'cannot approve',
        data: {},
    },
    {
        successful: false,
        errorCode: '06',
        message: `user isn't blocked`,
        data: {},
    },
    {
        successful: false,
        errorCode: '07',
        message: `user has been already blocked`,
        data: {},
    },
    {
        successful: false,
        errorCode: '08',
        message: 'this location already exist ',
        data: {},
    },
    {
        successful: false,
        errorCode: '09',
        message: 'this locker aready exist ',
        data: {},
    },
    {
        successful: false,
        errorCode: '10',
        message: 'cannot create with this location ',
        data: {},
    },
    {
        successful: false,
        errorCode: '11',
        message: 'do not have this department ',
        data: {},
    },
    {
        successful: false,
        errorCode: '12',
        message: 'cannot open this locker by FaceId ',
        data: {},
    },
    {
        successful: false,
        errorCode: '13',
        message: 'do not have this camera ',
        data: {},
    },
    {
        successful: false,
        errorCode: '14',
        message: 'department already exist in locker ',
        data: {},
    },
    {
        successful: false,
        errorCode: '15',
        message: 'cannot add temporaryDept',
        data: {},
    },
    {
        successful: false,
        errorCode: '16',
        message: 'do not have this tempDept ',
        data: {},
    },
    {
        successful: false,
        errorCode: '17',
        message: 'user already exist in locker ',
        data: {},
    },
    {
        successful: false,
        errorCode: '18',
        message: 'cannot add temporaryUser ',
        data: {},
    },
    {
        successful: false,
        errorCode: '19',
        message: 'do not have this video record ',
        data: {},
    },
    {
        successful: false,
        errorCode: '20',
        message: 'token do not match with this locker',
        data: {},
    },
    {
        successful: false,
        errorCode: '21',
        message: 'do not have this tempUser',
        data: {},
    },
    {
        successful: false,
        errorCode: '22',
        message: 'do not have this tempDept',
        data: {},
    },
    
]
