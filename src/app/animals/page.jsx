"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Pagination, Modal, Card, Skeleton } from "antd";
import Image from "next/image";
import styles from "./Animals.module.css";

const HEADERS = { "x-api-key": process.env.NEXT_PUBLIC_API_KEY };

export default function Animals() {
    const [data, setData] = useState({
        animals: [],
        loading: true,
        current: 1,
        pageSize: 0,
    });

    const [modalInfo, setModalInfo] = useState({
        visible: false,
        animal: null,
        species: null,
        loading: false,
    });


    useEffect(() => {
        const fetchAnimals = async () => {
            const cached = await caches.match("animalsData", [])
            if (cached) {
                setData({animals: JSON.parse(cached), loading: false, current: 1, pageSize: 5});
                return;
            }
            try {
                const {data: animals} = await axios.get( `${process.env.NEXT_PUBLIC_API_URL}/animals`,
                    {
                        headers: HEADERS,
                    }
                    );
                setData({animals, loading: false, current: 1, pageSize: 5});
            } catch {
                toast.error("Erro ao buscar dados de animais.");
                setData((a) => ({ ...a, loading: false }));
            }
        };
        fetchAnimals();
    }, []);

    const openModal = async (animal) => {
        setModalInfo({
            visible: true,
            animal,
            species: null,
            loading: true,
        });
        const cacheKey = `species_${animal.id}`;
        const cached = await caches.match(cacheKey, null);
        if (cached) {
            setModalInfo((a) => ({ ...a, species: JSON.parse(cached), loading: false }));
            return;
        }
        try {
            const { data: species } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/species/${animal.species_id}`,
                {
                    headers: HEADERS,
                }
            );
            setModalInfo((a) => ({ ...a, species, loading: false }));
        } catch {
            toast.error("Erro ao buscar dados de espécies.");
            setModalInfo((a) => ({ ...a, loading: false }));
        }
    };

    const paginatedAnimals = () => {
        const start = (data.current - 1) * data.pageSize;
        return data.animals.slice(start, start + data.pageSize);
    };

    return (
        <div>
            <h1>Lista de Animais</h1>
            <Pagination
                current={data.current}
                pageSize={data.pageSize}
                total={data.animals.length}
                onChange={(page, size) =>
                    setData((a) => ({ ...a, current: page, pageSize: size }))
                }
                showSizeChanger
                pageSizeOptions={[5, 10, 100]}
                />

                {data.loading ? (
                    <Image
                    src= "/images/loading.gif"
                    width={200}
                    height={200}
                    alt="Loading"
                    />
                ) : (
                    <div className={styles.cardsContainer}>
                        {paginatedAnimals().map((animal) => (
                            <Card
                                key={animal.id}
                                className={styles.card}
                                hoverable
                                onClick={() => openModal(animal)}
                                cover={
                                    <Image
                                        alt={animal.name_animals}
                                        src={animal.photo ? animal.photo.url : "/images/220.svg"}
                                        width={200}
                                        height={200}
                                    />
                                }
                            >
                                <Card.Meta
                                    title={animal.name_animals}
                                />
                            </Card>
                        ))}
                    </div>
                )}

            <Modal
            title={`Avaliação de ${modalInfo.animal?.name_animals}`}
            open={modalInfo.visible}
            onCancel={() => 
                setModalInfo({
                    visible: false,
                    animal: null,
                    species: null,
                    loading: false,
                })
            }
            onOk={() =>
                setModalInfo({
                    visible: false,
                    animal: null,
                    species: null,
                    loading: false,
                })
            }
            width={600}
            >
            {modalInfo.loading ? (
                <Skeleton active />
            ) : modalInfo.species ? (
                <div className={styles.speciesInfo}>
                    <p>
                        <span className={styles.label}>Raça:</span>{" "}
                        {modalInfo.species.race}
                    </p>
                    <p>
                        <span className={styles.label}>Descrição:</span>{" "}
                        {modalInfo.species.description}
                    </p>
                </div>
            ) : (
                <p style={{ textAlign: "center" }}>Avaliação não encontrada.</p>
        )}
            </Modal>

            <ToastContainer position="top-right" autoClose={4500} />
    </div>
    );
}