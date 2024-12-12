export function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let browserName, osName;

    // Detecting the browser
    if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
    } else if (userAgent.indexOf("MSIE") > -1 || !!document.DOCUMENT_NODE) {
        browserName = "Internet Explorer";
    } else {
        browserName = "Unknown";
    }

    // Detecting the OS
    if (userAgent.indexOf("Windows NT") > -1) {
        osName = "Windows";
    } else if (userAgent.indexOf("Mac OS") > -1) {
        osName = "Mac OS";
    } else if (userAgent.indexOf("Linux") > -1) {
        osName = "Linux";
    } else if (userAgent.indexOf("Android") > -1) {
        osName = "Android";
    } else if (userAgent.indexOf("like Mac OS") > -1) {
        osName = "iOS";
    } else {
        osName = "Unknown";
    }

    return browserName + " on " + osName;
}