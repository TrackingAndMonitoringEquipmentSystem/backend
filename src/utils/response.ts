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
  if (errorCode == '00' || errorCode == '30') {
    response.data = data;
  }
  // else if (errorCode == '30') {
  //     response.data == data;
  // }
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
  {
    successful: false,
    errorCode: '23',
    message: 'this type already exist',
    data: {},
  },
  {
    successful: false,
    errorCode: '24',
    message: 'do not have this type',
    data: {},
  },
  {
    successful: false,
    errorCode: '25',
    message: 'type and duration cannot be null',
    data: {},
  },
  {
    successful: false,
    errorCode: '26',
    message: 'do not have this equipment',
    data: {},
  },
  {
    successful: false,
    errorCode: '27',
    message: 'do not have this report',
    data: {},
  },
  {
    successful: false,
    errorCode: '28',
    message: 'cannot create report maintain ',
    data: {},
  },
  {
    successful: false,
    errorCode: '29',
    message: 'cannot create user with department and role ',
    data: {},
  },
  {
    successful: false,
    errorCode: '30',
    message: `Mac address already existed`,
    data: {},
  },
  {
    successful: false,
    errorCode: '31',
    message: 'equipment tag_id already exited.',
    data: {},
  },
  {
    successful: false,
    errorCode: '31',
    message: `tag_ids don't match`,
    data: {},
  },
  {
    successful: false,
    errorCode: '32',
    message: `cannot create user`,
    data: {},
  },
  {
    successful: false,
    errorCode: '99',
    message: 'Internal Server Error',
    data: {},
  },
];
