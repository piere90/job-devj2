<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\DBAL\Connection;

class MoviesController extends AbstractController
{
    #[Route('/api/movies')]
    public function list(Request $request, Connection $db): Response
    {

        // Recupera i parametri di query dalla richiesta
        $sortBy = $request->query->get('sort');
        $sortOrder = $request->query->get('order');

        $queryBuilder = $db->createQueryBuilder()
            ->select("m.*")
            ->from("movies", "m");

        if ($sortBy && $sortOrder) {
            $queryBuilder->orderBy("m.$sortBy", $sortOrder);
        } else {
            $queryBuilder->orderBy("m.release_date", "ASC");
        }

        $rows = $queryBuilder->setMaxResults(50)
                ->executeQuery()
                ->fetchAllAssociative();

        return $this->json([
            "movies" => $rows
        ]);
    }

    #[Route('/api/genres')]
    public function listGenres(Request $request, Connection $db): Response
    {

        //var_dump($request);exit;
        // Recupera i parametri di query dalla richiesta
        $genreschooser = $request->query->get('genreschooser');
        // var_dump($genreschooser);exit;
        $sortOrder = $request->query->get('order');

        $queryBuilder = $db->createQueryBuilder()
            ->select("g.*")
            ->from("genres", "g");

        $rows = $queryBuilder->setMaxResults(50)
                ->executeQuery()
                ->fetchAllAssociative();

        //var_dump($rows);exit;

        return $this->json([
            "genres" => $rows
        ]);
    }
}
