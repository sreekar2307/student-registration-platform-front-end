const constants = {
    'baseURL': "http://localhost:8080/api/v1/"
}
if (process.env.NODE_ENV === 'production') {
    constants['baseURL'] = 'http://ec2-15-206-82-30.ap-south-1.compute.amazonaws.com/api/v1/'
}

export default constants