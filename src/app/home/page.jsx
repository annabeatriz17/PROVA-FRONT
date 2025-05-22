"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Home.module.css";
import { Button, Skeleton } from "antd";

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.imageContainer}>
                    <Image className={styles.image} src="/images/eu.png" alt="Foto da aluna" width={200} height={200} />
                </div>
                <div className={styles.conteudo}>
                    <ul className={styles.list}>
                        <li>Anna Beatriz </li>
                        <li>Turma: 1TDS1</li>
                        <li>Matéria: Front-end</li>
                        <li>Atividade: Avaliação</li>
                        <li>Instrutores: Marcelo Carboni e Thiago Ferreira</li>
                        <li>Essa é a minha atividade avaliativa. Nessa atividade tenho a API animals e species, que retorna uma lista de espécies de animais. Minha tabela de animais tem relação com a tabela de espécies.</li>
                    </ul>
                </div>
        

            <Link href="/animals" prefetch>
                <Button className={styles.button} type="primary">Ir para a página de animais</Button>
            </Link>
            </div>
        </div>
    );
}
