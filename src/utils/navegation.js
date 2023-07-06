const checkIsNavigationSupported = () => Boolean(document.startViewTransition)

const fetchPage = async (url) => {
	const response = await fetch(url)
	const text = await response.text()
	const regex = /<body>([\s\S]*)<\/body>/i
	return text.match(regex)?.[1]
}

export const navigation = () => {
	if (!checkIsNavigationSupported) return

	window.navigation.addEventListener('navigate', (event) => {
		const toUrl = new URL(event.destination.url)
		if (location.origin !== toUrl.origin) return

		event.intercept({
			async handler () {
				const data = await fetchPage(toUrl.pathname)
				document.startViewTransition(() => {
					document.body.innerHTML = data
					document.documentElement.scrollTop = 0
				})
			}
		})
	})
}