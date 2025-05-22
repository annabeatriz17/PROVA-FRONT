"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Pagination, Modal, Card, Skeleton } from "antd";
import Image from "next/image";
import styles from "./Animals.module.css";

const apikey = "D6XanJL91NxF6V9L2PuKkh5UjSQGV1";
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
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchAnimals() {
            try {
                const response = await axios.get("http://localhost:3000/api/animals",
                    {
                        headers: {
                            "D6XanJL91NxF6V9L2PuKkh5UjSQGV1": apikey,
                        },
                    });
                setAnimals(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados de animais:", error);
            }
        }
        fetchAnimals();
    }, []);

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