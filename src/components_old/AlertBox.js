import "./alertBox.css"
const AlertBox = ({msg}) => {
    return (
        <div className="alert-toast tw-fixed tw-bottom-0 tw-right-0 tw-m-8 tw-w-5/6 md:tw-w-full tw-max-w-sm">
            {/* <input type="checkbox" className="hidden" id="footertoast" /> */}

                <label className="close tw-cursor-pointer tw-flex tw-items-start tw-justify-between tw-w-full tw-p-2 tw-bg-red-500 tw-h-24 tw-rounded tw-shadow-lg tw-text-white tw-text-base tw-font-normal" title="close" htmlFor="footertoast">
                   
                    { msg }

                    {/* <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                    </svg> */}
                </label>
        </div>
    )
}

export default AlertBox