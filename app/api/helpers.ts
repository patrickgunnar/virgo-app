// check if email is valid
export const isValidEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    return regex.test(email)
}

// remove special characters
export const removeSpecialChar = (data: string) => {
    const regex = /[^a-zA-Z0-9]/g

    return data.replace(regex, '')
}
