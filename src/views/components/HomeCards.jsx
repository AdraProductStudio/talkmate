import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import CustomButton from '../../reusable-components/CustomButton';
import Image from '../../utils/images';
import CustomSpinner from '../../reusable-components/CustomSpinner';
import { useNavigate } from 'react-router-dom';


export const HomeCards = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [loadingAction, setLoadingAction] = useState("")

    const cardsArray = [
        {
            id: 1,
            cardImage: Image.constructionWorkerForm,
            cardTitle: "Construction Worker Form",
            name: "Construction_worker_form_2.pdf",
            cardButtonText: "Use"
        },
    ]

    useEffect(() => {
        setLoading(false)
    }, [])

    const handleUse = async (selectedPdfName, cardTitle) => {
        setLoading(true)
        setLoadingAction(cardTitle)
        sessionStorage.setItem("selectedPdf", selectedPdfName)
        navigate("/update-information");
    };

    return (
        <Container className='main-section' fluid>
            <Container>
                <Row className='gap-5 justify-content-sm-center justify-content-lg-start'>
                    {cardsArray.map((item) => (
                        <Col key={item.id} xs={12} md={6} lg={4} xl={3} className='my-3'>
                            <Card className='w-100 w-sm-50 h-100 '>
                                <Card.Img variant="top" src={item.cardImage} className='img-fluid' alt={item.cardTitle} />
                                <Card.Body>
                                    <Card.Title className='card-title text-center'>{item.cardTitle}</Card.Title>
                                    <div onClick={() => handleUse(item.name, item.cardTitle)} className={`${loading && 'pe-none opacity-50'}`}>
                                        <CustomButton
                                            buttonName={loading && loadingAction === item.cardTitle ? <CustomSpinner variant="light" size="sm" /> : item.cardButtonText}
                                            className={`btn custom-button-sm`}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Container>
    )
}
