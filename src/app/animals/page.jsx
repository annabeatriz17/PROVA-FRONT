"use client";

import { use, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Pagination, Modal, Card, Skeleton } from "antd";
import { setContentSession } from "@/utils/contentSession";
import Image from "next/image";
import styles from "./Animals.module.css";

const HEADERS = { "x-api-key": process.env.NEXT_PUBLIC_API_KEY };

export default function Animals() {
    const [animals, setAnimals] = useState({
        animals: [],
        loading: true,
        current: 1,
        pageSize: 0,
    });

    const [modal, setModal] = useState({
        visible: false,
        animal: null,
        species: null,
        loading: false,
    });

    useEffect(() => {
        const fetchAnimals = async () => {
            const cached = getContentSession("animalsData", [])
            if (cached.length > 0) {
                setAnimals({ animals: cached, loading: false, current: 1, pageSize: 5 });
                return;
            }

            try {
                const { data: animals } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/animals`, {
                    headers: HEADERS,
                }
            );
            setContentSession("animalsData", animals);
            setAnimals({ animals, loading: false, current: 1, pageSize: 5 });
            } catch {
                toast.error("Não foi possível carregar os animais.");
                setAnimals({ ...a, loading: false });
            }
        };

        fetchAnimals();
    }, []);

    const openModal = async (animal) => {
        setModalInfo({ visible: true, animal, species: animal.species });

        const cacheKey = `species_${animal.id}`;
        const cached = getContentSession(cacheKey, null);
        if (cached) {
            setModalInfo({ ...m, species: cached, loading: false });
            return;
        }

        try {
            const { data: species } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/species/${animal.species}`, {
                headers: HEADERS,
            });
            setContentSession(cacheKey, species);
            setModalInfo({ ...m, species, loading: false });
        } catch {
            toast.error("Não foi possível carregar a espécie.");
            setModalInfo({ ...m, loading: false });
        }  
    };

    const paginatedAnimals = () => {
        const start = (animals.current - 1) * animals.pageSize;
        return animals.animals.slice(start, start + animals.pageSize);
    };

    return (
        <div>
            <h1>Lista de Animais</h1>

            <Pagination
                current={animals.current}
                pageSize={animals.pageSize}
                total={animals.animals.length}
                onChange={(page, size) =>
                    setAnimals((a) => ({ ...a, current: page, pageSize: size }))
                }
                showSizeChanger
                pageSizeOptions={[5, 20, 50, 100]}
                />

                {animals.loading ? (
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
            title={`Avaliação de ${modal.animal?.name_animals}`}
            open={modal.visible}
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
            {modal.loading ? (
                <Skeleton active />
            ) : modal.species ? (
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