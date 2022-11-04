export default {
    methods: {
        // This snippet is taken straight from https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        // It will only work on browser so if you are using in an SSR environment, keep your eyes open
        doesBrowserSupportPassiveScroll() {
            let passiveSupported = false;

            try {
                const options = {
                    get passive() {
                        // This function will be called when the browser
                        //   attempts to access the passive property.
                        passiveSupported = true;
                        // console.log(passiveSupported);
                        return false;
                    }
                };

                window.addEventListener("test", null, options);
                window.removeEventListener("test", null, options);
            } catch (err) {
                passiveSupported = false;
            }
            return passiveSupported;
        }
    }
};
