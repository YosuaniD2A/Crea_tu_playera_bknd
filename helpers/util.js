function base64EncodeRFC2045(API_KEY, API_SECRET) {
    const credentialsString = `${API_KEY}:${API_SECRET}`;
    const base64Credentials = Buffer.from(credentialsString).toString('base64');

    return base64Credentials;
}

module.exports = {
    base64EncodeRFC2045
}