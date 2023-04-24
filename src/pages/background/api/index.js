export const ajax = async ({
														 url,
														 method = 'GET',
														 data,
														 isInclude = false,
														 headers = { "Content-Type": "application/json" }
													 }) => {
	let credentials = isInclude ? 'include' : 'omit'
	let res = await fetch(url, {
		method,
		credentials,
		headers,
		body: JSON.stringify(data),
	}).then(res => res.json())
	return handleApiResult(res);
}

export const handleApiResult = (apiRes) => {
	return Object.assign({}, apiRes, { success: apiRes.err_no === 0 })
}