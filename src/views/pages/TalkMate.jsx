import React, { useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CustomInput from '../../reusable-components/CustomInput'
import CustomButton from '../../reusable-components/CustomButton'
import CustomInputGroup from '../../reusable-components/CustomInputGroup'
import { Link, replace, useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-toastify'
import sha256 from 'sha256';
import CustomSpinner from '../../reusable-components/CustomSpinner'
import PhoneInput from 'react-phone-input-2'
import Image from '../../utils/images'




const TalkMate = () => {

  const navigate = useNavigate()

  const [dialCode, setDialCode] = useState("")
  const [countryCode, setCountryCode] = useState(null)
  const [mobileNumber, setMobileNumber] = useState({
    mobileNumber: "",
    countryCode: ""
  })

  const [language, setLanguage] = useState("Select Language")


  const [loadingAction, setLoadingAction] = useState(null);


  const [loading, setLoading] = useState(false)


  const handleTalk = async () => {

    if (!mobileNumber.mobileNumber || language === "Select Language") {
      toast.warn("Please fill all the fields")
      return
    }

    try {
      setLoading(true)
      setLoadingAction("Call")
      const payload = {
        "to_phone": `+${countryCode}${mobileNumber.mobileNumber}`,
        "language": language,
      }

      const response = await axiosInstance.post("/talkmate_outbound_call", payload)

      if (response.data.error_code === 200) {
        sessionStorage.setItem("conversationId", response.data.data.conversation_id)
        sessionStorage.setItem("serviceId", response.data.data.service_id)
        setLoading(false)
        toast.success(response.data.message)
      } else {
        setLoading(false)
        toast.error(response.data.error_code)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }




  const handlePhoneInput = (e, phone, mobileNumber) => {
    setMobileNumber((prevState) => ({
      ...prevState,
      mobileNumber: e.slice(phone.dialCode.length),
      countryCode: phone.dialCode,
    }));
    setCountryCode(phone.dialCode)
    setDialCode(phone.dialCode)

  };

  return (
    <section className='layout'>
      <Header />
      <Container className='main-section' fluid >
        <Container className='d-flex flex-column justify-content-center align-items-center h-100' >
          <Row className="inputs-container px-3 px-md-5 py-3  rounded-3 col-12 col-md-8 col-lg-6 col-xl-5 " >
            <Col className='my-5 '>
              <h3 className="mb-5 text-center digiform-text d-flex align-items-center justify-content-center">
                <img
                  src={Image.talkmate}
                  alt="TalkMate logo"
                  style={{ width: "36px", height: "36px", marginRight: "8px" }}
                />
                TalkMate
              </h3>


              <div className="mb-3">
                <PhoneInput
                  id="floatingInput"
                  specialLabel="Mobile Number"
                  country={dialCode === "" ? "in" : dialCode}
                  dataTestid="mobileNumber"
                  countryCodeEditable={false}
                  enableSearch
                  onChange={(e, phone) =>
                    handlePhoneInput(e, phone, "mobileNumber")
                  }
                  value={`${countryCode}${mobileNumber.mobileNumber}`}
                  inputProps={{
                    alt: "mobileNumber",
                    type: "tel",
                    placeholder: "Mobile Number",
                    required: true,
                    style: { borderColor: "grey", backgroundColor: "white" },
                  }}
                />
              </div>

              <div className="mb-3">
                <Form.Select aria-label="select language" value={language} onChange={(e) => setLanguage(e.target.value)} size='lg' className='p-2 py-3 fs-6 border-1'>
                  <option className='fs-6'>Select Language</option>
                  {/* <option className='fs-6' value="English">English</option> */}
                  <option className='fs-6' value="English-IN">English-IN</option>
                  <option className='fs-6' value="English-US">English-US</option>
                  <option className='fs-6' value="English-UK">English-UK</option>
                </Form.Select>
              </div>


              <CustomButton
                buttonName={loading ? <CustomSpinner variant="light" size="sm" /> : "Talk"}
                // className={`btn custom-button-sm mt-5 mx-auto d-block w-100 cup py-2 ${loading && 'pe-none opacity-50'}`}
                className={`mt-4 btn w-100 custom-button d-block cup call-now-button col-12`}
                onClick={() => handleTalk()}
              />

              <p className='mt-4 text-center'>
                Back to
                <Link to="/" className='signup-login-navigation-link'> Log in</Link>
              </p>

            </Col>
          </Row>
        </Container>
      </Container >

      <Footer isFooterText={true} />

    </section>
  )
}

export default TalkMate
