"use client";

import Image from "next/image";
import styles from "./Home.module.css";

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                    <Image className={styles.image}
                    src="/image/eu.png" 
                    width={200}
                    height={200}
                    />
                    <h1 className={styles.name}>Eu</h1>
                    <p className={styles.description}>
                        <p>Turma: 1TDS1</p>
                        <p>Matéria: Front-end</p>
                        <p>Atividade: Avaliação</p>
                        <p>Instrutores: Marcelo Carboni e Thiago Ferreira</p>
                    </p>
            </div>
        </div>
    );
}
