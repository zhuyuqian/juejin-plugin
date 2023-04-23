export const ajax = async ({ url, method = 'GET', data, headers = { "Content-Type": "application/json" } }) => {
	let res = await fetch(url, {
		method,
		body: JSON.stringify(data),
		credentials: 'include',
		headers,
	}).then(res => res.json())
	return handleApiResult(res);
}

export const handleApiResult = (apiRes) => {
	return Object.assign({}, apiRes, { success: apiRes.err_no === 0 })
}