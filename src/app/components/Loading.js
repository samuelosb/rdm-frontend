/**
 * @module Loading
 *
 *  Component used to show a small loading hint when
 *  the data isn't ready yet to show on the application.
 */

"use client";
import {Container} from 'react-bootstrap';
import styles from './../page.module.css';
import {useTranslation} from 'react-i18next';

export default function Loading() {
    const {t} = useTranslation("global");

    return (
        <Container fluid className="mt-4">
            <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}>
                <img className={styles.rotate} src="/loading.png" width={28} alt="Loading"/>&nbsp;{t("results.loading")}
            </div>
        </Container>
    );
}
